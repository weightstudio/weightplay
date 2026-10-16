// Game-owned presentation adapter. Native rules, indices, labels and handlers survive.
(function () {
  'use strict';
  const roots=['cardGameHand','cardGameCenter'].map(id=>document.getElementById(id)).filter(Boolean);
  if(roots.length!==2||!window.WPCardTablePresentation)return;
  document.body.classList.add('wp-premium-table','casino-royal-table');
  document.body.dataset.gameVersion='v26';
  document.body.dataset.cardDeck='klondike';
  // Commit the shared logical Canvas envelope before tutorial UI or the first
  // player input can observe the newly opened Battle scene.
  window.addEventListener('weightplay:battle-open',()=>window.WeightPlayBattleCanvas?.sync?.());
  const signatures=new WeakMap();
  function decorate(root) {
    const signature=[...root.querySelectorAll('.playing-card')].map(card=>card.getAttribute('aria-label')).join('|');
    const previous=signatures.get(root);
    const changed=previous!==undefined&&previous!==signature;
    const priorLabels=new Set((previous||'').split('|'));
    signatures.set(root,signature);
    root.querySelectorAll('.playing-card:not([data-deck-rank]):not(.is-face-down)').forEach(card=>{
      const match=card.textContent.trim().match(/^(A|[2-9]|10|J|Q|K)([♠♥♣♦])$/u);
      if(!match)return; // Unknown/localized content is preserved, never guessed.
      const [,rank,suit]=match;
      card.classList.add('classic-card','front');
      if(changed&&!priorLabels.has(card.getAttribute('aria-label')))card.classList.add('casino-card-arrival');
      const corners=['top','bottom'].map(position=>{
        const node=document.createElement('span');node.className='rank '+position;node.textContent=rank;return node;
      });
      card.replaceChildren(...corners);
      window.WPCardTablePresentation.decorateCard(card,rank,suit);
    });
  }
  // The existing engine replaces these two roots on its native render cycle.
  // Observe their direct child lists only, not card descendants or the document.
  // Decorative writes therefore never retrigger the observer. No extra polling.
  const observers=roots.map(root=>new MutationObserver(()=>decorate(root)));
  function connect(){roots.forEach((root,i)=>{observers[i].observe(root,{childList:true});decorate(root);});}
  function disconnect(){observers.forEach(observer=>observer.disconnect());}
  window.addEventListener('pagehide',disconnect);
  window.addEventListener('pageshow',event=>{if(event.persisted)connect();});
  connect();

  const RETURN_COPY={
    en:{title:'Leave this round?',body:'Your current deal is still in progress.',continue:'Continue playing',leave:'Return to Main'},
    'zh-Hant':{title:'要離開這一局嗎？',body:'目前的牌局仍在進行中。',continue:'繼續遊戲',leave:'返回主畫面'},
    'zh-Hans':{title:'要离开本局吗？',body:'当前牌局仍在进行中。',continue:'继续游戏',leave:'返回主画面'},
    ja:{title:'このラウンドを終了しますか？',body:'現在のカード配りは進行中です。',continue:'続けてプレイ',leave:'メインに戻る'},
    ko:{title:'이번 라운드를 나갈까요?',body:'현재 게임은 진행 중입니다.',continue:'계속 플레이',leave:'메인으로 돌아가기'},
    es:{title:'¿Salir de esta ronda?',body:'La partida actual sigue en curso.',continue:'Seguir jugando',leave:'Volver al inicio'},
    'pt-BR':{title:'Sair desta rodada?',body:'Sua partida atual ainda está em andamento.',continue:'Continuar jogando',leave:'Voltar ao início'},
    fr:{title:'Quitter cette manche ?',body:'La donne actuelle est toujours en cours.',continue:'Continuer à jouer',leave:'Retourner à l’accueil'},
    de:{title:'Diese Runde verlassen?',body:'Das aktuelle Spiel läuft noch.',continue:'Weiterspielen',leave:'Zurück zum Hauptmenü'},
    it:{title:'Uscire da questa partita?',body:'La mano attuale è ancora in corso.',continue:'Continua a giocare',leave:'Torna alla schermata iniziale'},
    ru:{title:'Выйти из этого раунда?',body:'Текущая раздача ещё продолжается.',continue:'Продолжить игру',leave:'На главный экран'},
    hi:{title:'इस राउंड से बाहर जाएँ?',body:'आपका मौजूदा खेल अभी जारी है।',continue:'खेल जारी रखें',leave:'मुख्य स्क्रीन पर जाएँ'},
    ar:{title:'هل تريد مغادرة هذه الجولة؟',body:'التوزيعة الحالية ما زالت جارية.',continue:'متابعة اللعب',leave:'العودة إلى القائمة الرئيسية'},
  };
  const localeAliases={'zh-tw':'zh-Hant','zh-cn':'zh-Hans','pt-br':'pt-BR'};
  const getReturnCopy=()=>{
    const lang=document.documentElement.lang||'en';
    const locale=localeAliases[lang.toLowerCase()]||lang;
    return RETURN_COPY[locale]||RETURN_COPY.en;
  };
  const TUTORIAL_COPY={
    en:{title:'How to play Casino',steps:[['Choose a card','Select one card from your hand. Highlighted table cards can match its rank or add up to its value.'],['Choose an action','Capture takes selected table cards. Build stores a legal sum for a later capture.'],['Finish the turn','If you cannot capture or build, Trail plays your card. Spades and the 10♦/2♠ bonuses add to your score.'],],button:'Start Playing',help:'How to Play'},
    'zh-Hant':{title:'卡西諾玩法',steps:[['選擇手牌','選一張手牌；高亮的桌牌可與它同點數，或加總成相同點數。'],['選擇行動','「捕獲」收下選取的桌牌；「建立牌組」把合法加總留待之後捕獲。'],['完成回合','無法捕獲或建立牌組時，用「放牌」打出手牌。黑桃與 10♦／2♠ 特殊牌會增加分數。']],button:'開始遊戲',help:'玩法說明'},
    'zh-Hans':{title:'卡西诺玩法',steps:[['选择手牌','选一张手牌；高亮的桌牌可与它同点数，或加总成相同点数。'],['选择行动','“捕获”收下选中的桌牌；“建立牌组”把合法加总留待之后捕获。'],['完成回合','无法捕获或建立牌组时，用“放牌”打出手牌。黑桃与 10♦／2♠ 特殊牌会增加分数。']],button:'开始游戏',help:'玩法说明'},
    ja:{title:'カシノの遊び方',steps:[['手札を選ぶ','手札を1枚選びます。光った場札は同じランクか、合計が同じ値のカードです。'],['アクションを選ぶ','「取る」で選んだ場札を獲得。「ビルド」では合計を作り、あとで獲得できます。'],['手番を終える','取ることもビルドもできない場合は「出す」で手札を場に置きます。スペードと10♦／2♠のボーナスで得点します。']],button:'プレイ開始',help:'遊び方'},
    ko:{title:'카지노 플레이 방법',steps:[['패 선택하기','손에서 카드 한 장을 고르세요. 강조된 테이블 카드는 같은 값이거나 합계가 선택한 카드와 같습니다.'],['행동 선택하기','잡기로 선택한 테이블 카드를 가져오세요. 빌드는 합계를 만들어 나중에 잡을 수 있게 합니다.'],['차례 마치기','잡거나 빌드할 수 없으면 내기로 카드를 내려놓으세요. 스페이드와 10♦／2♠ 보너스가 점수에 더해집니다.']],button:'플레이 시작',help:'플레이 방법'},
    es:{title:'Cómo jugar al Casino',steps:[['Elige una carta','Elige una carta de tu mano. Las cartas resaltadas de la mesa tienen el mismo valor o suman ese valor.'],['Elige una acción','Capturar recoge las cartas seleccionadas. Construir guarda una suma legal para capturarla después.'],['Termina el turno','Si no puedes capturar ni construir, Jugar pone tu carta en la mesa. Las picas y los bonus del 10♦/2♠ suman puntos.']],button:'Empezar a jugar',help:'Cómo jugar'},
    'pt-BR':{title:'Como jogar Casino',steps:[['Escolha uma carta','Escolha uma carta da mão. As cartas destacadas na mesa têm o mesmo valor ou somam esse valor.'],['Escolha uma ação','Capturar pega as cartas selecionadas. Construir guarda uma soma válida para capturar depois.'],['Encerre a vez','Se não puder capturar nem construir, Jogar coloca sua carta na mesa. Espadas e bônus do 10♦/2♠ aumentam a pontuação.']],button:'Começar a jogar',help:'Como jogar'},
    fr:{title:'Comment jouer au Casino',steps:[['Choisissez une carte','Choisissez une carte de votre main. Les cartes de table en évidence ont la même valeur ou forment cette somme.'],['Choisissez une action','Capturer prend les cartes sélectionnées. Construire réserve une somme valide pour une capture ultérieure.'],['Terminez le tour','Sans capture ni construction possible, Poser met votre carte sur la table. Les piques et les bonus du 10♦/2♠ rapportent des points.']],button:'Commencer à jouer',help:'Comment jouer'},
    de:{title:'So spielt man Casino',steps:[['Karte wählen','Wähle eine Handkarte. Markierte Tischkarten haben denselben Rang oder ergeben zusammen ihren Wert.'],['Aktion wählen','Mit Nehmen erhältst du die ausgewählten Tischkarten. Bauen legt eine passende Summe für später bereit.'],['Zug beenden','Wenn Nehmen und Bauen nicht möglich sind, legst du die Karte mit Ausspielen ab. Pik sowie die 10♦/2♠-Boni bringen Punkte.']],button:'Jetzt spielen',help:'Spielanleitung'},
    it:{title:'Come giocare a Casino',steps:[['Scegli una carta','Scegli una carta dalla mano. Le carte evidenziate sul tavolo hanno lo stesso valore o formano la stessa somma.'],['Scegli un’azione','Prendi raccoglie le carte selezionate. Costruisci prepara una somma valida da catturare più avanti.'],['Termina il turno','Se non puoi prendere né costruire, Gioca mette la carta sul tavolo. Picche e bonus del 10♦/2♠ aumentano il punteggio.']],button:'Inizia a giocare',help:'Come si gioca'},
    ru:{title:'Как играть в Кассино',steps:[['Выберите карту','Выберите карту из руки. Подсвеченные карты на столе совпадают по рангу или дают такую же сумму.'],['Выберите действие','«Взять» забирает выбранные карты. «Построить» сохраняет допустимую сумму для взятия позже.'],['Завершите ход','Если взять или построить нельзя, сыграйте карту на стол через «Ход». Пики и бонусы 10♦/2♠ дают очки.']],button:'Начать игру',help:'Как играть'},
    hi:{title:'कैसिनो कैसे खेलें',steps:[['पत्ता चुनें','अपने हाथ से एक पत्ता चुनें। हाइलाइट किए गए टेबल पत्ते उसी रैंक के हैं या मिलकर वही मान बनाते हैं।'],['चाल चुनें','पकड़ें चुने हुए टेबल पत्ते लेता है। बनाएँ सही योग को बाद में पकड़ने के लिए रखता है।'],['चाल पूरी करें','यदि पकड़ना या बनाना संभव न हो, तो चलें आपका पत्ता टेबल पर रखता है। स्पेड और 10♦/2♠ बोनस स्कोर बढ़ाते हैं।']],button:'खेलना शुरू करें',help:'खेलने का तरीका'},
    ar:{title:'طريقة لعب كاسينو',steps:[['اختر بطاقة','اختر بطاقة من يدك. البطاقات المميزة على الطاولة تطابق رتبتها أو تكوّن مجموع قيمتها.'],['اختر حركة','يلتقط يأخذ بطاقات الطاولة المحددة. البناء يحفظ مجموعاً صالحاً لالتقاطه لاحقاً.'],['أنه دورك','إذا تعذر الالتقاط أو البناء، العب يضع بطاقتك على الطاولة. البستوني ومكافأتا 10♦ و2♠ تزيدان نقاطك.']],button:'ابدأ اللعب',help:'طريقة اللعب'},
  };
  const getTutorialCopy=()=>{
    const lang=document.documentElement.lang||'en';
    const locale=localeAliases[lang.toLowerCase()]||lang;
    return TUTORIAL_COPY[locale]||TUTORIAL_COPY.en;
  };
  const loadingPanel=document.getElementById('loadingPanel');
  const loadingCard=loadingPanel?.querySelector('.loading-card');
  const loadingTitle=loadingCard?.querySelector('[data-casino-loading-title]');
  const loadingMessage=loadingCard?.querySelector('[data-casino-loading-message]');
  const loadingCopy={en:['Casino','Preparing your table…'],'zh-Hant':['卡西諾','正在準備牌桌…'],'zh-Hans':['卡西诺','正在准备牌桌…'],ja:['カシノ','テーブルを準備中…'],ko:['카지노','테이블을 준비하는 중…'],es:['Casino clásico','Preparando la mesa…'],'pt-BR':['Cassino','Preparando a mesa…'],fr:['Casino','Préparation de la table…'],de:['Casino','Tisch wird vorbereitet…'],it:['Cassino','Preparazione del tavolo…'],ru:['Кассино','Подготовка стола…'],hi:['कैसिनो','टेबल तैयार हो रही है…'],ar:['كاسينو','جارٍ تجهيز الطاولة…']};
  const syncLoadingCopy=()=>{
    const lang=document.documentElement.lang||'en';
    const locale=localeAliases[lang.toLowerCase()]||lang;
    const copy=loadingCopy[locale]||loadingCopy.en;
    if(loadingTitle)loadingTitle.textContent=copy[0];
    if(loadingMessage)loadingMessage.textContent=copy[1];
  };
  syncLoadingCopy();
  const settleLoading=()=>{
    if(!loadingPanel)return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      loadingPanel.setAttribute('aria-busy','false');
      loadingPanel.classList.add('hidden');
    }));
  };
  window.addEventListener('load',settleLoading,{once:true});
  if(document.readyState==='complete')settleLoading();
  const tutorialGuide=document.querySelector('.game-page-info');
  if(tutorialGuide){
    const tutorialButton=document.createElement('button');
    tutorialButton.type='button';
    tutorialButton.className='casino-tutorial-help';
    tutorialGuide.prepend(tutorialButton);
    let tutorialLayer=null;
    const tutorialSeenKey='weightplay_tutorial_seen_casino_v1';
    const closeTutorial=()=>{
      if(!tutorialLayer)return;
      tutorialLayer.remove();
      tutorialLayer=null;
      document.body.classList.remove('casino-tutorial-open');
      try{localStorage.setItem(tutorialSeenKey,'1');}catch{}
      const focusTarget=document.getElementById('battleScreen')?.hidden===false
        ?document.getElementById('battleBackBtn')
        :tutorialButton;
      focusTarget?.focus({preventScroll:true});
    };
    const showTutorial=()=>{
      if(tutorialLayer)return;
      const battleScreen=document.getElementById('battleScreen');
      const battleCanvas=battleScreen?.querySelector('[data-wp-logical-battle-canvas]');
      const owner=battleScreen&&!battleScreen.hidden?battleCanvas:document.getElementById('mainScreen');
      if(!owner)return;
      const copy=getTutorialCopy();
      tutorialLayer=document.createElement('div');
      tutorialLayer.id='tutorialPanel';
      tutorialLayer.className='casino-tutorial-overlay';
      tutorialLayer.setAttribute('role','dialog');
      tutorialLayer.setAttribute('aria-modal','true');
      tutorialLayer.setAttribute('aria-labelledby','casinoTutorialTitle');
      const panel=document.createElement('section');
      panel.className='casino-tutorial-card';
      const heading=document.createElement('h2');
      heading.id='casinoTutorialTitle';
      heading.textContent=copy.title;
      const steps=document.createElement('ol');
      steps.className='casino-tutorial-steps';
      copy.steps.forEach(([title,text])=>{
        const item=document.createElement('li');
        const strong=document.createElement('strong');
        const body=document.createElement('span');
        strong.textContent=title;body.textContent=text;item.append(strong,body);steps.append(item);
      });
      const start=document.createElement('button');
      start.type='button';start.className='casino-tutorial-start';start.textContent=copy.button;
      start.setAttribute('data-wp-tutorial-next','');
      panel.append(heading,steps,start);tutorialLayer.append(panel);
      owner.append(tutorialLayer);
      document.body.classList.add('casino-tutorial-open');
      start.focus({preventScroll:true});
      start.addEventListener('click',closeTutorial);
      panel.addEventListener('keydown',event=>{
        if(event.key==='Escape'){event.preventDefault();closeTutorial();}
        if(event.key==='Tab'){event.preventDefault();start.focus();}
      });
    };
    const syncTutorialButton=()=>{tutorialButton.textContent=getTutorialCopy().help;};
    syncTutorialButton();
    tutorialButton.addEventListener('click',showTutorial);
    const tutorialLocaleObserver=new MutationObserver(syncTutorialButton);
    tutorialLocaleObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    window.addEventListener('wonder:locale-change',syncTutorialButton);
    window.addEventListener('pagehide',()=>tutorialLocaleObserver.disconnect(),{once:true});
    window.addEventListener('pageshow',event=>{
      if(event.persisted)tutorialLocaleObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    });
    window.addEventListener('weightplay:battle-open',()=>{
      let seen=false;try{seen=localStorage.getItem(tutorialSeenKey)==='1';}catch{}
      if(!seen)showTutorial();
    });
  }
  const battle=document.getElementById('battleScreen');
  const backButton=document.getElementById('battleBackBtn');
  const resultOverlay=document.getElementById('resultOverlay');
  const battleCanvas=battle?.querySelector('[data-wp-logical-battle-canvas]');
  const cardPlaySurface=battle?.querySelector('.card-table-ui');
  // Result and leave confirmation are Battle substates, so keep them inside
  // Casino's one shared logical Canvas instead of creating viewport portals.
  if(battleCanvas&&resultOverlay?.parentElement!==battleCanvas)battleCanvas.append(resultOverlay);
  if(battle&&backButton&&resultOverlay){
    const confirmLayer=document.createElement('div');
    confirmLayer.id='casinoLeaveConfirm';
    confirmLayer.className='casino-return-confirm';
    confirmLayer.hidden=true;
    const panel=document.createElement('section');
    panel.className='casino-return-card';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    const heading=document.createElement('h2');
    heading.id='casinoLeaveTitle';
    const message=document.createElement('p');
    message.id='casinoLeaveMessage';
    const actions=document.createElement('div');
    actions.className='casino-return-actions';
    const continueButton=document.createElement('button');
    continueButton.type='button';
    continueButton.className='casino-return-continue';
    continueButton.id='casinoReturnContinue';
    const leaveButton=document.createElement('button');
    leaveButton.type='button';
    leaveButton.className='casino-return-leave';
    leaveButton.id='casinoReturnLeave';
    panel.setAttribute('aria-labelledby',heading.id);
    panel.setAttribute('aria-describedby',message.id);
    panel.append(heading,message,actions);
    actions.append(continueButton,leaveButton);
    confirmLayer.append(panel);
    (battleCanvas||document.body).append(confirmLayer);

    const syncBattleInteraction=()=>{
      const blocked=!resultOverlay.hidden||!confirmLayer.hidden;
      if(cardPlaySurface){
        cardPlaySurface.inert=blocked;
        if(blocked)cardPlaySurface.setAttribute('aria-hidden','true');
        else cardPlaySurface.removeAttribute('aria-hidden');
      }
    };
    const resultStateObserver=new MutationObserver(()=>{
      const resultOpen=!resultOverlay.hidden;
      syncBattleInteraction();
      if(resultOpen)resultOverlay.querySelector('.result-actions button:not(:disabled)')?.focus({preventScroll:true});
      else if(document.activeElement?.closest('#resultOverlay'))backButton.focus({preventScroll:true});
    });
    resultStateObserver.observe(resultOverlay,{attributes:true,attributeFilter:['hidden']});
    syncBattleInteraction();

    let allowReturn=false;
    const syncCopy=()=>{
      const copy=getReturnCopy();
      heading.textContent=copy.title;
      message.textContent=copy.body;
      continueButton.textContent=copy.continue;
      leaveButton.textContent=copy.leave;
    };
    syncCopy();
    const localeObserver=new MutationObserver(syncCopy);
    localeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    const closeConfirm=()=>{
      confirmLayer.hidden=true;
      document.body.classList.remove('casino-return-confirm-open');
      syncBattleInteraction();
      backButton.focus({preventScroll:true});
    };
    const openConfirm=()=>{
      if(!confirmLayer.hidden)return;
      confirmLayer.hidden=false;
      document.body.classList.add('casino-return-confirm-open');
      syncBattleInteraction();
      continueButton.focus({preventScroll:true});
    };
    backButton.addEventListener('click',event=>{
      if(allowReturn||battle.hidden||!resultOverlay.hidden)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      openConfirm();
    },true);
    continueButton.addEventListener('click',closeConfirm);
    leaveButton.addEventListener('click',()=>{
      confirmLayer.hidden=true;
      document.body.classList.remove('casino-return-confirm-open');
      syncBattleInteraction();
      allowReturn=true;
      backButton.click();
      allowReturn=false;
      document.getElementById('startBtn')?.focus({preventScroll:true});
    });
    panel.addEventListener('keydown',event=>{
      if(event.key==='Escape'){
        event.preventDefault();
        closeConfirm();
        return;
      }
      if(event.key!=='Tab')return;
      const buttons=[continueButton,leaveButton];
      const first=buttons[0],last=buttons[buttons.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    window.addEventListener('pagehide',()=>{localeObserver.disconnect();resultStateObserver.disconnect();},{once:true});
    window.addEventListener('pageshow',event=>{
      if(event.persisted)localeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    });
  }
})();
