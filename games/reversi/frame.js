/* Reversi content adapter: shared Frame owns chrome and physical geometry. */
(() => {
  'use strict';
  window.mountReversiI9 = (app, effectsReady) => {
    const loader = window.WeightPlayGameEntryLoader;
    const root = app.root, main = app.main, battle = app.battle;
    root.querySelector('.logic-lab').className='reversi-scenes';
    const q = selector => root.querySelector(selector);
    const start = q('#startButton'), back = q('#battleBack');
    back.removeAttribute('data-wp-battle-utility');
    const mainHeader = main.querySelector('header'), battleHeader = battle.querySelector('header');
    const content = q('.logic-battle-wrap'), hero = q('.logic-hero');
    const leave = q('#logicLeave'), stay = q('#leaveContinue'), exit = q('#leaveStages');
    const result = app.result, replay = q('#resultReplay'), menu = q('#resultMenu'), review = q('#resultClose');
    const guide = document.querySelector('.game-page-info-static');
    const copy = {
      en:['Leave this match?','The current board will be discarded. Continue keeps every disc and the pending rival move.','Continue playing','Return to Main','Review board'],
      'zh-Hant':['離開這場對局？','返回主頁會放棄目前棋盤。繼續遊戲會保留所有棋子與待執行的對手回應。','繼續遊戲','返回主頁','查看棋盤'],
      'zh-Hans':['离开这场对局？','返回主页会放弃当前棋盘。继续游戏会保留所有棋子与待执行的对手回应。','继续游戏','返回主页','查看棋盘'],
      ja:['この対局を終了しますか？','メインに戻ると盤面は失われます。続けるとすべての石と相手の次の手が保持されます。','対局を続ける','メインに戻る','盤面を見る'],
      ko:['이 대국을 나갈까요?','메인으로 돌아가면 현재 보드를 잃습니다. 계속하면 모든 돌과 상대의 대기 중인 수가 유지됩니다.','계속 플레이','메인으로 돌아가기','보드 보기'],
      es:['¿Salir de la partida?','Volver al inicio descarta el tablero. Continuar conserva las fichas y la jugada pendiente del rival.','Seguir jugando','Volver al inicio','Ver tablero'],
      'pt-BR':['Sair desta partida?','Voltar ao início descarta o tabuleiro. Continuar mantém as peças e a jogada pendente do rival.','Continuar jogando','Voltar ao início','Ver tabuleiro'],
      fr:['Quitter cette partie ?','Le retour à l’accueil abandonne le plateau. Continuer conserve les pions et le coup adverse en attente.','Continuer à jouer','Retour à l’accueil','Voir le plateau'],
      de:['Diese Partie verlassen?','Zurück zum Menü verwirft das Brett. Weiterspielen behält alle Steine und den ausstehenden Gegnerzug.','Weiterspielen','Zum Hauptmenü','Brett ansehen'],
      it:['Uscire dalla partita?','Tornare al menu scarta la scacchiera. Continuare mantiene le pedine e la mossa avversaria in attesa.','Continua a giocare','Torna al menu','Vedi scacchiera'],
      ru:['Выйти из партии?','Возврат в меню сбросит поле. Продолжение сохранит фишки и ожидающий ход соперника.','Продолжить игру','В главное меню','Посмотреть поле'],
      hi:['यह बाज़ी छोड़ें?','मुख्य मेनू पर लौटने से बोर्ड हट जाएगा। जारी रखने पर सभी गोटियाँ और प्रतिद्वंद्वी की अगली चाल बनी रहेंगी।','खेल जारी रखें','मुख्य मेनू','बोर्ड देखें'],
      ar:['مغادرة هذه المباراة؟','العودة للرئيسية تلغي اللوحة. المتابعة تحفظ جميع الأقراص وحركة الخصم المعلقة.','متابعة اللعب','العودة للرئيسية','عرض اللوحة'],
    };
    const labels = copy[document.documentElement.lang] || copy.en;
    const official = window.WEIGHTPLAY_GAME_TITLES?.reversi?.[document.documentElement.lang] || app.title;
    mainHeader.querySelector('h1').textContent = official;
    for (const header of [mainHeader,battleHeader]) header.querySelector('h1').dataset.wpFrameTitle = '';
    mainHeader.querySelector('h1').dataset.wpGameTitle = '';
    const source = document.createElement('div'); source.hidden = true;
    source.append(q('.logic-header-tools')); root.append(source);
    mainHeader.replaceChildren(mainHeader.querySelector('[data-wp-return]'), mainHeader.querySelector('h1'));
    main.classList.remove('logic-main'); hero.className = 'reversi-main-content';
    const poster = hero.querySelector('.main-poster'); poster.dataset.wpFramePoster = '';
    hero.querySelector('.logic-poster').replaceWith(poster);
    const mainCopy = hero.querySelector('.logic-copy'); mainCopy.className = 'reversi-main-copy'; mainCopy.dataset.wpFrameCopy = '';
    mainCopy.querySelectorAll('.logic-kicker,.logic-facts,[data-wp-main-progress]').forEach(node=>node.remove());
    mainCopy.querySelector('h2').textContent = official;
    mainCopy.querySelector('p').dataset.wpFrameSummary = '';
    start.dataset.wpFrameAction = 'primary'; start.className = '';
    main.querySelector('.logic-guide')?.remove();
    app.stage.remove();
    app.board.className='reversi-board-host';
    app.board.setAttribute('role','group');app.board.setAttribute('aria-label',official);
    battle.className = 'reversi-battle'; content.className = 'reversi-play-content';
    const playfield = content.querySelector('.logic-board-panel');
    playfield.className = 'reversi-board-window'; playfield.dataset.wpScrollOwner = '';
    const notes = document.createElement('aside'); notes.className = 'reversi-notes';
    const gameInfo = document.createElement('div'); gameInfo.className='reversi-game-info'; gameInfo.dataset.wpScrollOwner='';
    gameInfo.append(app.tutorial,app.status);notes.append(gameInfo);content.append(notes);
    const actions = content.querySelector('.logic-action-row'); notes.append(actions);
    const chip = app.battleChip;
    battleHeader.replaceChildren(back,battleHeader.querySelector('h1'));
    const frame = window.WeightPlayScreenFrame.mount({root,playUI:true,scenes:{
      main:{root:main,header:mainHeader,content:hero},battle:{root:battle,header:battleHeader,content},
    }});
    const group = window.WeightPlayScreenFrame.createGroup(); group.add(chip); frame.battleTopUI.add(group);
    for (const button of [q('#logicHint'),q('#logicReset'),stay,exit,replay,menu,review]) {
      button.classList.remove('logic-primary','logic-secondary'); button.dataset.wpFrameAction = 'secondary';
    }
    stay.dataset.wpFrameAction = replay.dataset.wpFrameAction = 'primary';
    leave.querySelector('h2').textContent = labels[0]; leave.querySelector('p').textContent = labels[1];
    stay.textContent = labels[2]; exit.textContent = menu.textContent = labels[3]; review.textContent = labels[4];
    let scene = 'main', covered = null, ended = false;
    const sync = () => {
      const blocked = covered !== null;
      leave.hidden = covered !== 'leave'; result.hidden = covered !== 'result';
      content.inert = blocked; app.board.inert = blocked;
      q('#logicHint').disabled = ended;
      frame.activate(scene,{covered:blocked});
      if (guide) {guide.hidden=scene!=='main';guide.inert=scene!=='main';}
    };
    const mainReturn = () => {
      scene='main';covered=null;ended=false;app.showMain();sync();start.focus({preventScroll:true});
    };
    const begin = (repeat=false) => {
      scene='battle';covered=null;ended=false;
      if (repeat) app.replay(); else app.startGame();
      const panel=app.board.firstElementChild,toolbar=panel.querySelector('.logic-board-toolbar');
      panel.className='reversi-board-panel';
      if(toolbar)gameInfo.replaceChildren(toolbar,panel.querySelector('.logic-reversi-policy'),panel.querySelector('.logic-reversi-reply'),app.tutorial,app.status);
      sync(); q('.logic-reversi-board .legal')?.focus({preventScroll:true});
    };
    const closeLeave = () => {
      covered=null;sync();app.getActiveGame()?.resume?.();back.focus({preventScroll:true});
    };
    const openLeave = () => {
      if (ended) return mainReturn();
      if (covered) return;
      app.getActiveGame()?.pause?.();covered='leave';sync();stay.focus({preventScroll:true});
    };
    app.screenFlow = {
      start:()=>begin(), battleBack:openLeave,
      reset:()=>begin(true), resultReplay:()=>begin(true), resultMenu:mainReturn,
      resultClose:()=>{covered=null;sync();back.focus({preventScroll:true});},
      leaveContinue:closeLeave, leaveStages:mainReturn,
    };
    app.cfg.onResult = () => {ended=true;covered='result';sync();requestAnimationFrame(()=>replay.focus({preventScroll:true}));};
    for (const dialog of [leave,result]) dialog.addEventListener('keydown',event=>{
      if (event.key==='Escape'&&dialog===leave) {event.preventDefault();closeLeave();return;}
      if (event.key!=='Tab') return;
      const controls=[...dialog.querySelectorAll('button:not([disabled])')].filter(n=>!n.hidden&&n.getClientRects().length);
      const first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first?.focus();}
    });
    const pause=()=>{if(scene==='battle'&&!ended)app.getActiveGame()?.pause?.();};
    const resume=()=>{if(scene==='battle'&&!ended&&!covered&&!document.hidden&&document.hasFocus()
      &&!battle.querySelector('.wp-frame-popover:not([hidden])'))app.getActiveGame()?.resume?.();};
    window.addEventListener('weightplay:interaction-state',()=>battle.querySelector('.wp-frame-popover:not([hidden])')?pause():resume());
    window.addEventListener('blur',pause);window.addEventListener('focus',resume);
    content.addEventListener('focusin',()=>{
      if(battle.querySelector('.wp-frame-popover:not([hidden])'))frame.close();
    });
    app.board.addEventListener('focusin',event=>{
      const cell=event.target.closest('.logic-cell');if(!cell)return;
      app.board.querySelectorAll('.logic-cell').forEach(node=>{node.tabIndex=node===cell?0:-1;});
    });
    app.board.addEventListener('keydown',event=>{
      const cell=event.target.closest('.logic-cell');if(!cell||ended)return;
      const cells=[...cell.parentElement.children],index=cells.indexOf(cell),rtl=document.documentElement.dir==='rtl';
      const step={ArrowLeft:rtl?1:-1,ArrowRight:rtl?-1:1,ArrowUp:-8,ArrowDown:8}[event.key];
      if(step===undefined)return;
      const next=index+step;if(next<0||next>=64||((event.key==='ArrowLeft'||event.key==='ArrowRight')&&Math.floor(next/8)!==Math.floor(index/8)))return;
      event.preventDefault();cells[next].focus({preventScroll:true});cells[next].scrollIntoView({block:'nearest',inline:'nearest'});
    });
    document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
    sync();
    let settled=false,loaded=0;const abort=new AbortController();
    const fail=()=>{if(settled||abort.signal.aborted)return;settled=true;clearTimeout(timeout);abort.abort();loader.fail(undefined,()=>location.reload());};
    const timeout=setTimeout(fail,20000);
    const images=['/assets/reversi-cover-v1.webp','/assets/card-table/emerald-table-v1.webp'].map(src=>new Promise((resolve,reject)=>{
      const image=new Image();image.onload=()=>{image.onload=image.onerror=null;if(!settled&&!abort.signal.aborted)loader.assetProgress(++loaded,3);resolve();};
      image.onerror=()=>{image.onload=image.onerror=null;reject(new Error('REVERSI_REQUIRED_ART'));};
      abort.signal.addEventListener('abort',()=>{image.onload=image.onerror=null;},{once:true});image.src=src;
    }));
    Promise.all([...images,effectsReady.then(()=>{if(!settled&&!abort.signal.aborted)loader.assetProgress(++loaded,3);})]).then(()=>requestAnimationFrame(()=>{
      if(settled||abort.signal.aborted)return;settled=true;clearTimeout(timeout);abort.abort();start.disabled=false;loader.ready();
    })).catch(fail);
    window.addEventListener('pagehide',event=>{pause();clearTimeout(timeout);abort.abort();if(!event.persisted)frame.destroy();});
    window.addEventListener('pageshow',event=>{if(event.persisted){if(!settled)return location.reload();sync();resume();}});
    return frame;
  };
})();
