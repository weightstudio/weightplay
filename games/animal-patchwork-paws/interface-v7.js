(()=>{
  'use strict';
  const copy={
    en:{start:'Start Game',stages:'Stages',title:'Leave this stage?',body:'{stage}: current tile rotations and this run’s turns will be discarded. Cleared stages stay saved.',continue:'Continue playing',leave:'Return to Stages'},
    'zh-Hant':{start:'開始遊戲',stages:'關卡',title:'要離開這一關嗎？',body:'{stage}：目前拼片方向與本次轉動次數會捨棄；已完成的關卡仍會保留。',continue:'繼續遊戲',leave:'返回關卡'},
    'zh-Hans':{start:'开始游戏',stages:'关卡',title:'要离开这一关吗？',body:'{stage}：当前拼片方向与本次转动次数会丢失；已完成的关卡仍会保留。',continue:'继续游戏',leave:'返回关卡'},
    ja:{start:'ゲーム開始',stages:'ステージ',title:'このステージを離れますか？',body:'{stage}：現在のタイル向きと今回の回転数は失われます。クリア済みステージは保存されます。',continue:'プレイを続ける',leave:'ステージへ戻る'},
    ko:{start:'게임 시작',stages:'스테이지',title:'이 스테이지를 나갈까요?',body:'{stage}: 현재 타일 방향과 이번 플레이의 회전 수는 사라집니다. 완료한 스테이지는 저장됩니다.',continue:'계속 플레이',leave:'스테이지로 돌아가기'},
    es:{start:'Iniciar juego',stages:'Niveles',title:'¿Salir de este nivel?',body:'{stage}: se perderán las orientaciones actuales y los giros de esta partida. Los niveles completados seguirán guardados.',continue:'Seguir jugando',leave:'Volver a Niveles'},
    'pt-BR':{start:'Iniciar jogo',stages:'Fases',title:'Sair desta fase?',body:'{stage}: as orientações atuais e os giros desta partida serão descartados. As fases concluídas continuam salvas.',continue:'Continuar jogando',leave:'Voltar às Fases'},
    fr:{start:'Démarrer',stages:'Niveaux',title:'Quitter ce niveau ?',body:'{stage} : les orientations actuelles et les rotations de cette partie seront perdues. Les niveaux terminés restent enregistrés.',continue:'Continuer à jouer',leave:'Retour aux Niveaux'},
    de:{start:'Spiel starten',stages:'Level',title:'Dieses Level verlassen?',body:'{stage}: Die aktuellen Ausrichtungen und Drehungen dieses Laufs gehen verloren. Abgeschlossene Level bleiben gespeichert.',continue:'Weiterspielen',leave:'Zurück zu Level'},
    it:{start:'Inizia gioco',stages:'Livelli',title:'Uscire da questo livello?',body:'{stage}: gli orientamenti attuali e le rotazioni di questa partita andranno persi. I livelli completati restano salvati.',continue:'Continua a giocare',leave:'Torna ai Livelli'},
    ru:{start:'Начать игру',stages:'Уровни',title:'Выйти из этого уровня?',body:'{stage}: текущие повороты плиток и ходы этой попытки будут потеряны. Пройденные уровни останутся сохранены.',continue:'Продолжить игру',leave:'К уровням'},
    hi:{start:'गेम शुरू करें',stages:'स्तर',title:'इस स्तर से बाहर जाएँ?',body:'{stage}: टाइलों की मौजूदा दिशा और इस प्रयास के घुमाव हट जाएँगे। पूरे किए गए स्तर सुरक्षित रहेंगे।',continue:'खेलते रहें',leave:'स्तरों पर लौटें'},
    ar:{start:'ابدأ اللعبة',stages:'المراحل',title:'هل تريد مغادرة هذه المرحلة؟',body:'{stage}: ستُفقد اتجاهات القطع الحالية وعدد اللفات في هذه المحاولة، بينما تبقى المراحل المكتملة محفوظة.',continue:'متابعة اللعب',leave:'العودة إلى المراحل'},
  };
  const normalizeLocale=()=>{
    const raw=document.documentElement.lang||'en';
    if(/^zh-(tw|hant)/i.test(raw))return 'zh-Hant';
    if(/^zh/i.test(raw))return 'zh-Hans';
    if(/^pt/i.test(raw))return 'pt-BR';
    return copy[raw]?raw:(copy[raw.split('-')[0]]?raw.split('-')[0]:'en');
  };
  const text=()=>copy[normalizeLocale()]||copy.en;
  const stageName=()=>document.getElementById('patchTitle')?.textContent?.trim()||text().stages;
  let overlay,continueBtn,leaveBtn,titleNode,bodyNode,allowBack=false,covered=[];

  function applyLabels(){
    const labels=text();
    const start=document.getElementById('startBtn');
    if(start){start.removeAttribute('data-i18n');start.dataset.runtimeLocalize='off';start.textContent=labels.start;}
    const tab=document.querySelector('#stageScreen .stage-tabs button');
    if(tab){tab.removeAttribute('data-i18n');tab.dataset.runtimeLocalize='off';tab.textContent=labels.stages;}
    if(overlay){
      titleNode.textContent=labels.title;
      bodyNode.textContent=labels.body.replace('{stage}',stageName());
      continueBtn.textContent=labels.continue;
      leaveBtn.textContent=labels.leave;
    }
  }

  function buildDialog(){
    const battle=document.getElementById('battleScreen');
    if(!battle||overlay)return;
    overlay=document.createElement('section');
    overlay.className='wp-patchwork-leave-overlay';
    overlay.hidden=true;
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','wp-patchwork-leave-title');
    overlay.innerHTML='<div class="wp-patchwork-leave-card"><h2 id="wp-patchwork-leave-title"></h2><p></p><div class="wp-patchwork-leave-actions"><button type="button" data-wp-leave-continue></button><button type="button" data-wp-leave-confirm></button></div></div>';
    titleNode=overlay.querySelector('h2');
    bodyNode=overlay.querySelector('p');
    continueBtn=overlay.querySelector('[data-wp-leave-continue]');
    leaveBtn=overlay.querySelector('[data-wp-leave-confirm]');
    battle.append(overlay);
    continueBtn.addEventListener('click',closeDialog);
    leaveBtn.addEventListener('click',()=>{
      closeDialog(false);
      const back=document.getElementById('battleBackBtn');
      if(!back)return;
      allowBack=true;
      back.click();
      allowBack=false;
    });
  }

  function openDialog(){
    buildDialog();
    if(!overlay)return;
    applyLabels();
    covered=[...document.getElementById('battleScreen').children]
      .filter(node=>node!==overlay)
      .map(node=>({node,inert:Boolean(node.inert)}));
    covered.forEach(({node})=>{node.inert=true;});
    overlay.hidden=false;
    requestAnimationFrame(()=>continueBtn.focus({preventScroll:true}));
  }

  function closeDialog(restoreFocus=true){
    if(!overlay||overlay.hidden)return;
    overlay.hidden=true;
    covered.forEach(({node,inert})=>{node.inert=inert;});
    covered=[];
    if(restoreFocus)document.getElementById('battleBackBtn')?.focus({preventScroll:true});
  }

  function onBattleBack(event){
    if(allowBack||document.body.dataset.screen!=='battle')return;
    /* Once the board is already solved, progress is saved and the authored
       result transition is no longer mutable play; direct Stage return is safe. */
    if(document.getElementById('status')?.classList.contains('good'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(overlay&&!overlay.hidden)closeDialog();
    else openDialog();
  }

  function onKeydown(event){
    if(!overlay||overlay.hidden)return;
    if(event.key==='Escape'){
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDialog();
      return;
    }
    if(event.key!=='Tab')return;
    const actions=[continueBtn,leaveBtn];
    const current=actions.indexOf(document.activeElement);
    const next=event.shiftKey?(current<=0?actions.length-1:current-1):(current<0||current===actions.length-1?0:current+1);
    event.preventDefault();
    actions[next].focus({preventScroll:true});
  }

  function init(){
    buildDialog();
    applyLabels();
    document.getElementById('battleBackBtn')?.addEventListener('click',onBattleBack,true);
    document.getElementById('localeSelect')?.addEventListener('change',()=>queueMicrotask(applyLabels));
    window.addEventListener('wonder:locale-change',()=>queueMicrotask(applyLabels));
    window.addEventListener('weightplay:shell-sync',()=>queueMicrotask(applyLabels));
    document.addEventListener('keydown',onKeydown,true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
