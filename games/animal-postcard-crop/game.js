/* v7: measured atlas windows; shared Stage/flow and original artwork preserved. */
(() => {
  'use strict';
  const E=window.PostcardCropEngine, cards=window.PostcardCropCards;
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
  const asset='/games/animal-postcard-crop/assets/';
  // Generated routes may replace #gameGuide with an anonymous shared guide.
  // Optional document content must never interrupt a gameplay transition.
  const guides=[...document.querySelectorAll('[data-wp-game-guide],.game-page-info')];
  if (!$('gameGuide') && guides[0]) guides[0].id='gameGuide';
  const showGuides=visible=>guides.forEach(node=>{node.hidden=!visible;});
  let browseIndex=0;
  const unlockedIndex=()=>Math.min(cards.length-1,Math.max(0,save.medals.findLastIndex(value=>value>0)+1));
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
  const stage=document.createElement('section');
  stage.id='stageScreen';stage.hidden=true;stage.className='pc-stage';
  Object.assign(stage.dataset,{screen:'stage',wpStandardStageScreen:'',wpStageLandscapeWidth:'760',wpStageLandscapeHeight:'334',wpStageArt:asset+'animal-postcard-crop-cover-v2.webp'});
  stage.style.setProperty('--wp-stage-art',`url('${stage.dataset.wpStageArt}')`);
  stage.innerHTML=`<header id="stageHeader"><button id="stageBack" type="button" data-wp-return="stage" data-act="stageBack" data-label="back"></button><span data-wp-frame-title hidden></span></header>
    <div id="stageContent" class="pc-stage-content" data-wp-frame-content="stage" data-wp-stage-workspace>
      <div id="stageRail" class="stage-rail" data-wp-stage-rail role="list" dir="ltr"></div>
      <p id="stageHint" class="pc-stage-hint"></p>
    </div>
    <nav data-wp-frame-stage-nav><button id="stagesTab" type="button" data-wp-frame-stage-slot="stages" data-wp-frame-action="tab" data-act="stagesTab" aria-current="page" aria-pressed="true"></button></nav>`;
  $('app').append(stage);
  $('stageHint').textContent=stageLabels[1];$('stagesTab').textContent=stageLabels[0];
  $('stageRail').setAttribute('aria-label',stageLabels[0]);

  let save;try{save=E.sanitizeSave(JSON.parse(read('weightplay-postcard-album-v5')),cards.length);}catch{save=E.sanitizeSave(null,cards.length);}
  let state={screen:'main',mode:'idle',index:0,pose:{...cards[0].start},moves:0,errors:0,hinted:false,par:0};
  let storageOK=true,epoch=0,gesture=null,previousFocus=null;
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
  Object.assign(battle.dataset,{wpBattleCanvasRoot:'',wpLogicalBattleCanvas:'',wpBattleMinWidth:'390',wpBattleMinHeight:'640',wpBattleLandscapeWidth:'760',wpBattleLandscapeHeight:'334'});
  battle.innerHTML=`<header id="battleHeader"><button type="button" id="battleBack" data-wp-return="battle" data-act="back" data-label="back"></button><span data-wp-frame-title hidden></span></header>
    <div id="battleContent" class="pc-workspace" data-wp-frame-content="battle">
      <div id="battleInfo" data-wp-frame-info><div><span data-copy="card"></span><strong id="cardCount"></strong></div><div><span data-copy="moves"></span><strong id="moveCount"></strong></div><div><span data-copy="par"></span><strong id="parCount"></strong></div></div>
      <section class="pc-clues"><p id="chapterName"></p><p><strong data-copy="include"></strong> <span id="targetText"></span></p><p><strong data-copy="exclude"></strong> <span id="avoidText"></span></p><p id="cornerText"></p></section>
      <div id="sceneTrack" class="pc-scene-track"><div id="sceneGrid" class="pc-scene" role="group" tabindex="0" aria-describedby="positionText battleStatus"><div id="tileLayer" class="pc-tiles"></div><div id="postcardFrame" class="pc-frame" aria-hidden="true"></div><div id="captureLight" class="pc-capture-light" aria-hidden="true"></div></div></div>
      <div class="pc-status"><p id="battleStatus" role="status" aria-live="polite"></p><p id="positionText" class="pc-sr-only"></p></div>
      <div class="pc-controls" data-wp-frame-logical-actions="battle"><div class="pc-directions" dir="ltr">${button('left')}${button('up')}${button('down')}${button('right')}</div><div class="pc-tools">${button('rotate')}${button('hint')}${button('reset')}${button('capture','capture',true)}</div></div>
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
  if(summary){summary.textContent=L.summary;if(summary.previousElementSibling?.tagName==='P')summary.previousElementSibling.textContent=L.page.status;}
  const guideLink=document.querySelector('#mainContent a[href="#gameGuide"]');if(guideLink)guideLink.textContent=t('guide');
  const startLabels=['Start Game','開始遊戲','开始游戏','ゲーム開始','게임 시작','Iniciar juego','Iniciar jogo','Commencer','Spiel starten','Inizia a giocare','Начать игру','खेल शुरू करें','ابدأ اللعب'];
  $('startButton').textContent=startLabels[keys.indexOf(locale)];
  const frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:select,scenes:{
    main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},
    stage:{root:stage,header:$('stageHeader'),content:$('stageContent')},
    battle:{root:battle,header:$('battleHeader'),content:$('battleContent'),headerInfo:$('battleInfo')}
  }});
  const stageController=window.WeightPlayStageV6.install($('stageRail'),{
    total:cards.length,poolSize:9,initialIndex:()=>browseIndex,
    bind(node,index){
      const card=cards[index],locked=index>unlockedIndex(),medal=save.medals[index];
      node.className='stage-card pc-stage-card';node.setAttribute('aria-disabled',String(locked));
      node.classList.toggle('locked',locked);
      if(!node.firstElementChild){
        const group=document.createElement('span');group.setAttribute('data-wp-item-content','');
        for(const name of ['number','chapter','objective','status']){const part=document.createElement(name==='number'?'strong':'span');part.dataset.pcCardPart=name;group.append(part);}
        node.append(group);
      }
      const put=(part,value)=>{const target=node.querySelector(`[data-pc-card-part="${part}"]`);if(target.textContent!==value)target.textContent=value;};
      put('number',`${t('card')} ${index+1}`);put('chapter',L.chapters[card.chapter]);
      put('objective',card.targets.map(value=>L.scenes[value]).join(' · '));
      put('status',locked?stageLabels[2]:medal?`${stageLabels[4]} · ${'★'.repeat(medal)}${'☆'.repeat(3-medal)}`:stageLabels[3]);
      node.setAttribute('aria-label',`${t('card')} ${index+1}. ${L.chapters[card.chapter]}. ${locked?stageLabels[2]:medal?stageLabels[4]:stageLabels[3]}`);
    },
    onChange(index){browseIndex=index;},
    activate(index){if(state.screen==='stage'&&index<=unlockedIndex())startCard(index);}
  });
  // Re-centering is delegated to the shared rail, including a scaler refit.
  const stageResize=new ResizeObserver(()=>{if(state.screen==='stage')stageController.center(browseIndex);});
  stageResize.observe($('stageContent'));
  $('resultPanel').querySelector('[data-act="stages"]').textContent=stageLabels[0];
  function showStages(index=unlockedIndex()){
    cancelMotion();audio?.stop();browseIndex=Math.max(0,Math.min(cards.length-1,index));
    state.screen='stage';state.mode='idle';battle.hidden=true;$('mainScreen').hidden=true;showGuides(false);
    $('resultPanel').hidden=true;$('leavePanel').hidden=true;$('battleContent').inert=false;stage.hidden=false;
    if(reserve)reserve.hidden=false;
    frame.activate('stage');stageController.refresh();stageController.center(browseIndex);
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
  function progress(){const count=save.medals.filter(Boolean).length,total=save.medals.reduce((a,b)=>a+b,0);return `${t('album')} ${count}/${cards.length} · ${t('stars')} ${total}/${cards.length*3}`;}
  function persist(){try{localStorage.setItem('weightplay-postcard-album-v5',JSON.stringify(save));storageOK=true;}catch{storageOK=false;}}
  function showMain(){
    cancelMotion();audio?.stop();state.screen='main';state.mode='idle';
    battle.hidden=true;stage.hidden=true;if(reserve)reserve.hidden=true;$('mainScreen').hidden=false;showGuides(true);
    $('resultPanel').hidden=true;$('leavePanel').hidden=true;$('battleContent').inert=false;
    frame.activate('main');$('mainProgress').textContent=progress();$('startButton').focus({preventScroll:true});
  }
  function renderPosition(){
    const {pose,index}=state,card=cards[index],inside=E.crop(card,pose),f=$('postcardFrame');
    Object.assign(f.style,{left:`${pose.x*25}%`,top:`${pose.y*100/3}%`,width:`${pose.w*25}%`,height:`${pose.h*100/3}%`});
    tiles.forEach((n,i)=>n.classList.toggle('pc-in-frame',inside.includes(card.cells[i])));
    $('positionText').textContent=t('position',{x:pose.x+1,y:pose.y+1,w:pose.w,h:pose.h});
    $('moveCount').textContent=String(state.moves);
    for(const action of ['up','down','left','right','rotate'])battle.querySelector(`[data-act="${action}"]`).disabled=!E.step(card,pose,action);
  }
  function startCard(index){
    window.WeightPlayAudio?.preload?.(['game.start','ui.tick','feedback.hint','feedback.error','feedback.success','result.win'])?.catch(()=>{});
    index=Math.max(0,Math.min(cards.length-1,index));if(index>unlockedIndex())return;
    cancelMotion();audio?.stop();const card=cards[index];
    const solution=E.solve(card);if(!solution)throw new Error(`Unsolvable postcard ${index+1}`);
    state={screen:'battle',mode:'play',index,pose:{...card.start},moves:0,errors:0,hinted:false,par:solution.length};
    $('mainScreen').hidden=true;stage.hidden=true;showGuides(false);battle.hidden=false;if(reserve)reserve.hidden=false;$('resultPanel').hidden=true;$('leavePanel').hidden=true;
    $('battleContent').inert=false;frame.activate('battle');
    $('chapterName').textContent=L.chapters[card.chapter];$('cardCount').textContent=`${index+1}/${cards.length}`;$('parCount').textContent=String(state.par);
    $('targetText').textContent=card.targets.map(i=>L.scenes[i]).join(' · ');$('avoidText').textContent=card.avoid.map(i=>L.scenes[i]).join(' · ');
    $('cornerText').textContent=card.corner===null?'':t('corner',{name:L.scenes[card.corner]});
    tiles.forEach((n,i)=>{const v=card.cells[i];window.PostcardCropAtlas.apply(n,v);n.firstChild.textContent=L.scenes[v];n.setAttribute('aria-label',L.scenes[v]);n.classList.remove('pc-wrong');});
    $('sceneGrid').setAttribute('aria-label',`${t('card')} ${index+1}. ${$('targetText').textContent}. ${$('avoidText').textContent}`);
    $('battleStatus').textContent=t('ready');renderPosition();fitBoard();
    tween($('tileLayer'),[{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],320);
    sound('game.start');$('sceneGrid').focus({preventScroll:true});
  }
  function action(name,viaHint=false){
    if(state.mode!=='play'||state.screen!=='battle')return false;
    const next=E.step(cards[state.index],state.pose,name);if(!next)return false;
    state.pose=next;state.moves++;tiles.forEach(n=>n.classList.remove('pc-wrong'));renderPosition();
    $('battleStatus').textContent=viaHint?t('hintStep',{action:t(name)}):t('ready');
    if(!viaHint)sound('ui.tick');return true;
  }
  function hint(){
    if(state.mode!=='play')return;
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
    const next=$('resultPanel').querySelector('[data-act="next"]');next.textContent=t('next');next.disabled=state.index>=cards.length-1;
    tween($('resultPanel').firstChild,[{opacity:0,transform:'translateY(18px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],330);(next.disabled?$('resultPanel').querySelector('[data-act="stages"]'):next).focus({preventScroll:true});
  }
  function capture(){
    if(state.mode!=='play')return;
    const check=E.evaluate(cards[state.index],state.pose);
    if(!check.ok){state.errors++;$('battleStatus').textContent=t('wrong');sound('feedback.error');
      tiles.forEach((n,i)=>n.classList.toggle('pc-wrong',check.missing.includes(cards[state.index].cells[i])||check.unwanted.includes(cards[state.index].cells[i])));
      tween($('tileLayer'),[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],220);return;}
    state.mode='capturing';save.medals[state.index]=Math.max(save.medals[state.index],E.stars(state.moves,state.par,state.errors,state.hinted));persist();
    $('battleStatus').textContent=t('success');sound(state.index===cards.length-1?'result.win':'feedback.success');
    tween($('captureLight'),[{opacity:0},{opacity:.28,offset:.3},{opacity:0}],360);
    tween($('tileLayer'),[{transform:'scale(1)'},{transform:'scale(.98)',offset:.4},{transform:'scale(1)'}],420);
    later(result,520);
  }
  function requestLeave(){
    if(state.mode==='result'){showStages();return;}if(state.mode!=='play')return;
    cancelMotion();previousFocus=document.activeElement;state.mode='leave';$('battleContent').inert=true;frame.activate('battle',{covered:true});$('leavePanel').hidden=false;
    tween($('leavePanel').firstChild,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],180);
    $('leavePanel').querySelector('[data-act="stay"]').focus({preventScroll:true});
  }
  function stay(){if(state.mode!=='leave')return;$('leavePanel').hidden=true;state.mode='play';$('battleContent').inert=false;frame.activate('battle');(previousFocus?.isConnected?previousFocus:$('sceneGrid')).focus({preventScroll:true});}
  on($('app'),'click',event=>{
    const node=event.target.closest('[data-act]');if(!node||node.disabled)return;
    const name=node.dataset.act;
    if(event.detail>1&&['result','leave'].includes(state.mode))return;
    if(name==='start'&&state.screen==='main')showStages();
    else if(name==='stageBack'&&state.screen==='stage')showMain();
    else if(name==='stagesTab'&&state.screen==='stage')stageController.center(browseIndex);
    else if(name==='back')requestLeave();else if(name==='capture')capture();else if(name==='hint')hint();
    else if(name==='reset'&&state.mode==='play')startCard(state.index);
    else if(name==='replay'&&state.mode==='result')startCard(state.index);
    else if(name==='next'&&state.mode==='result'&&state.index<cards.length-1)startCard(state.index+1);
    else if(name==='stages'&&state.mode==='result')showStages();
    else if(name==='leave'&&state.mode==='leave')showStages(state.index);
    else if(name==='stay')stay();else action(name);
  });
  on(document,'keydown',event=>{
    if(event.defaultPrevented||event.repeat||event.ctrlKey||event.altKey||event.metaKey)return;
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
  on(window,'pagehide',event=>{pauseMotion();if(!event.persisted){resize.disconnect();stageResize.disconnect();stageController.destroy();frame.destroy();audio?.dispose();abort.abort();}});
  on(reduce,'change',()=>{pauseMotion();renderPosition();});
  $('mainProgress').textContent=progress();frame.activate('main');$('app').dataset.pcReady='v6';
  // Canonical entry is locale-neutral; explicit localized routes always win over saved preferences.
  if(pathLocale<0&&/^https?:$/.test(location.protocol)&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname)){
    const url=new URL(location.href);url.pathname=`/${routeNames[keys.indexOf(locale)]}/games/animal-postcard-crop/`;url.searchParams.delete('lang');location.replace(url.href);
  }
})();
