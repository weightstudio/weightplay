(()=>{
  "use strict";

  const result=document.getElementById("resultModal");
  if(!result)return;
  const resultStage=document.getElementById("resultStage");
  const next=document.getElementById("next");
  const retry=document.getElementById("retry");
  const actions=result.querySelector(".modal-actions");
  const feedback=document.getElementById("feedback");
  const resultText=document.getElementById("resultText");
  let lastMissSide=null,lastRecapKey=null;

  const missCue=()=>lastMissSide&&window.PrismBreakersLocale?.miss?.(lastMissSide);

  const remainingBlocks=engine=>Array.isArray(engine?.blocks)?engine.blocks.filter(block=>Number(block?.hp)>0).length:0;

  const settleLearningRecap=()=>{
    if(result.hidden||!resultText)return;
    const state=window.__blockTrilogyTest?.getState?.();
    const engine=state?.engine;
    if(state?.kind!=="breaker"||!engine)return;
    const blocks=remainingBlocks(engine),success=blocks===0;
    if(!success&&Number(engine.lives)!==0)return;
    const key=[state.selected,engine.score,engine.bestCombo,engine.lives,blocks,success,lastMissSide||""].join(":");
    if(lastRecapKey===key)return;
    const recap=window.PrismBreakersLocale?.resultRecap?.({success,score:engine.score,combo:engine.bestCombo,orbs:engine.lives,blocks,side:success?null:(state.selected===1?lastMissSide:null)});
    if(!recap)return;
    const base=resultText.dataset.prismBaseText??resultText.textContent.trim();
    resultText.dataset.prismBaseText=base;
    resultText.textContent=`${base} ${recap}`;
    lastRecapKey=key;
  };

  window.addEventListener("weightplay:breaker-orb-miss",event=>{
    const detail=event.detail;
    if(detail?.gameId!=="animal-prism-breakers"||detail.stage!==1)return;
    lastMissSide=detail.ballX<detail.paddleX?"left":"right";
    queueMicrotask(()=>{
      const cue=missCue();
      if(cue&&feedback)feedback.textContent=cue;
      if(cue&&detail.livesAfter===0&&resultText)resultText.textContent=cue;
    });
  });

  const settleVersion4Actions=()=>{
    if(result.hidden||!resultStage||!next||!retry||!actions)return;
    actions.append(resultStage,next,retry);
    const state=window.__blockTrilogyTest?.getState?.();
    const canContinue=Boolean(!next.hidden&&state?.engine?.lives>0&&state?.selected<30);
    next.hidden=false;
    next.disabled=!canContinue;
    next.setAttribute("aria-disabled",String(!canContinue));
    resultStage.classList.toggle("primary",!canContinue);
    next.classList.toggle("primary",canContinue);
    retry.classList.remove("primary");
    setTimeout(()=>{
      if(!result.hidden)(canContinue?next:resultStage).focus({preventScroll:true});
    },40);
  };

  const settleTerminalFailure=()=>{
    if(result.hidden)return;
    const state=window.__blockTrilogyTest?.getState?.();
    const engine=state?.engine;
    if(state?.kind!=="breaker"||engine?.lives!==0)return;
    const values={statA:engine.score,statC:engine.lives,resultA:engine.score,resultB:engine.bestCombo,resultC:engine.lives};
    for(const [id,value] of Object.entries(values)){
      const node=document.getElementById(id);
      if(node)node.textContent=String(value);
    }
    const cue=missCue();
    if(state.selected===1&&cue&&resultText)resultText.textContent=cue;
    settleVersion4Actions();
  };

  new MutationObserver(()=>{
    if(result.hidden){
      lastRecapKey=null;
      resultText?.removeAttribute("data-prism-base-text");
      return;
    }
    settleTerminalFailure();
    settleLearningRecap();
    settleVersion4Actions();
  }).observe(result,{attributes:true,attributeFilter:["hidden"]});
})();

(()=>{
  "use strict";
  const GAME_VERSION="v15";
  const result=document.getElementById("resultModal"),dialog=result?.querySelector(".dialog"),actions=result?.querySelector(".modal-actions");
  if(!result||!dialog||!actions)return;
  const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||"en";
  const copies={
    en:{title:"One-orb practice cue",summary:"Show the one-orb practice cue",left:"The miss came from the left. Watch the orb meet the centred paddle zone after moving left earlier.",right:"The miss came from the right. Watch the orb meet the centred paddle zone after moving right earlier.",zone:"Centred meeting zone",note:"No score or orb is spent here. Close the cue or choose Retry for a fresh scored run."},
    "zh-Hant":{title:"單球練習提示",summary:"查看單球練習提示",left:"剛才從左側漏球。觀察提早向左移後，光球如何在球拍中央區域接住。",right:"剛才從右側漏球。觀察提早向右移後，光球如何在球拍中央區域接住。",zone:"中央接球區",note:"這裡不會消耗分數或光球。關閉提示，或選擇重試開始新的計分嘗試。"},
    "zh-Hans":{title:"单球练习提示",summary:"查看单球练习提示",left:"刚才从左侧漏球。观察更早向左移动后，光球如何在球拍中央区域接住。",right:"刚才从右侧漏球。观察更早向右移动后，光球如何在球拍中央区域接住。",zone:"中央接球区",note:"这里不会消耗分数或光球。关闭提示，或选择重试开始新的计分尝试。"},
    ja:{title:"1球練習キュー",summary:"1球練習キューを見る",left:"左側へ抜けました。早めに左へ動くと、光球がパドル中央のゾーンに届く様子を見られます。",right:"右側へ抜けました。早めに右へ動くと、光球がパドル中央のゾーンに届く様子を見られます。",zone:"中央のミートゾーン",note:"ここではスコアも光球も消費しません。閉じるか、リトライで新しい計測付きの挑戦を始めてください。"},
    ko:{title:"빛 구슬 하나 연습 안내",summary:"빛 구슬 하나 연습 안내 보기",left:"왼쪽으로 빠졌습니다. 더 일찍 왼쪽으로 움직이면 빛 구슬이 패들 중앙 구역에 닿는 모습을 볼 수 있습니다.",right:"오른쪽으로 빠졌습니다. 더 일찍 오른쪽으로 움직이면 빛 구슬이 패들 중앙 구역에 닿는 모습을 볼 수 있습니다.",zone:"중앙 접촉 구역",note:"여기서는 점수나 빛 구슬을 소모하지 않습니다. 닫거나 재도전으로 새 점수 시도를 시작하세요."},
    es:{title:"Práctica de un orbe",summary:"Mostrar la práctica de un orbe",left:"El orbe pasó por la izquierda. Mira cómo llega a la zona central de la pala al moverte antes a la izquierda.",right:"El orbe pasó por la derecha. Mira cómo llega a la zona central de la pala al moverte antes a la derecha.",zone:"Zona de contacto central",note:"Aquí no gastas puntuación ni orbes. Cierra la guía o pulsa Reintentar para una nueva partida puntuable."},
    "pt-BR":{title:"Treino com um orbe",summary:"Mostrar treino com um orbe",left:"O orbe passou pela esquerda. Veja-o chegar à zona central da raquete ao mover-se mais cedo para a esquerda.",right:"O orbe passou pela direita. Veja-o chegar à zona central da raquete ao mover-se mais cedo para a direita.",zone:"Zona central de contato",note:"Nenhum ponto ou orbe é gasto aqui. Feche a dica ou escolha Tentar novamente para uma nova tentativa com pontuação."},
    fr:{title:"Entraînement avec un orbe",summary:"Afficher l’entraînement avec un orbe",left:"L’orbe est passé à gauche. Observez-le atteindre la zone centrale de la raquette en partant plus tôt à gauche.",right:"L’orbe est passé à droite. Observez-le atteindre la zone centrale de la raquette en partant plus tôt à droite.",zone:"Zone de contact centrale",note:"Aucun score ni orbe n’est consommé ici. Fermez l’aide ou choisissez Réessayer pour une nouvelle tentative comptée."},
    de:{title:"Übung mit einer Lichtkugel",summary:"Übung mit einer Lichtkugel zeigen",left:"Die Kugel ging links vorbei. Beobachte, wie sie die mittlere Schlägerzone erreicht, wenn du dich früher nach links bewegst.",right:"Die Kugel ging rechts vorbei. Beobachte, wie sie die mittlere Schlägerzone erreicht, wenn du dich früher nach rechts bewegst.",zone:"Mittlere Treffzone",note:"Hier werden weder Punkte noch Lichtkugeln verbraucht. Schließe den Hinweis oder wähle Neustart für einen neuen gewerteten Versuch."},
    it:{title:"Allenamento con una sfera",summary:"Mostra l’allenamento con una sfera",left:"La sfera è passata a sinistra. Guarda come raggiunge la zona centrale della racchetta spostandoti prima a sinistra.",right:"La sfera è passata a destra. Guarda come raggiunge la zona centrale della racchetta spostandoti prima a destra.",zone:"Zona centrale di contatto",note:"Qui non consumi punti né sfere. Chiudi il suggerimento o scegli Riprova per un nuovo tentativo con punteggio."},
    ru:{title:"Тренировка с одной сферой",summary:"Показать тренировку с одной сферой",left:"Сфера прошла слева. Посмотрите, как она достигает центральной зоны платформы, если раньше двинуться влево.",right:"Сфера прошла справа. Посмотрите, как она достигает центральной зоны платформы, если раньше двинуться вправо.",zone:"Центральная зона встречи",note:"Здесь очки и сферы не расходуются. Закройте подсказку или выберите повтор для новой попытки с подсчётом очков."},
    hi:{title:"एक प्रकाश गोले का अभ्यास",summary:"एक प्रकाश गोले का अभ्यास दिखाएँ",left:"गोला बाईं ओर से निकल गया। पहले बाईं ओर जाने पर वह पैडल के बीच वाले क्षेत्र तक कैसे पहुँचता है, देखें।",right:"गोला दाईं ओर से निकल गया। पहले दाईं ओर जाने पर वह पैडल के बीच वाले क्षेत्र तक कैसे पहुँचता है, देखें।",zone:"बीच का संपर्क क्षेत्र",note:"यहाँ स्कोर या प्रकाश गोला खर्च नहीं होता। संकेत बंद करें या नई स्कोर वाली कोशिश के लिए फिर प्रयास चुनें।"},
    ar:{title:"تدريب كرة ضوء واحدة",summary:"إظهار تدريب كرة ضوء واحدة",left:"مرّت الكرة من اليسار. راقب وصولها إلى منطقة المضرب الوسطى بعد التحرك يسارًا مبكرًا.",right:"مرّت الكرة من اليمين. راقب وصولها إلى منطقة المضرب الوسطى بعد التحرك يمينًا مبكرًا.",zone:"منطقة الالتقاء الوسطى",note:"لا تُستهلك نقاط أو كرة هنا. أغلق التلميح أو اختر الإعادة لبدء محاولة جديدة محسوبة."}
  };
  const copy=copies[locale]||copies.en;
  const cue=document.createElement("section");
  cue.id="directionalRehearsal";
  cue.className="directional-rehearsal";
  cue.hidden=true;
  cue.setAttribute("aria-live","polite");
  cue.innerHTML='<p class="rehearsal-lead"><strong class="rehearsal-title"></strong></p><details class="rehearsal-details"><summary class="rehearsal-summary"></summary><div class="rehearsal-track" role="img"><span class="rehearsal-path" aria-hidden="true"></span><span class="rehearsal-zone" aria-hidden="true"></span><span class="rehearsal-paddle" aria-hidden="true"></span><span class="rehearsal-orb" aria-hidden="true"></span></div><p class="rehearsal-note"></p></details>';
  dialog.insertBefore(cue,actions);
  const title=cue.querySelector(".rehearsal-title"),summary=cue.querySelector(".rehearsal-summary"),track=cue.querySelector(".rehearsal-track"),note=cue.querySelector(".rehearsal-note"),details=cue.querySelector("details");
  track.setAttribute("aria-label",copy.zone);
  let lastMissSide=null;
  const hide=()=>{lastMissSide=null;cue.hidden=true;details.open=false};
  const show=side=>{if(!copy[side])return;cue.dataset.side=side;title.textContent=copy.title;summary.textContent=copy.summary;summary.setAttribute("aria-label",copy.summary);note.textContent=copy[side];details.open=false;cue.hidden=false};
  window.addEventListener("weightplay:breaker-orb-miss",event=>{
    const detail=event.detail;
    if(detail?.gameId!=="animal-prism-breakers"||detail.stage!==1)return;
    lastMissSide=detail.ballX<detail.paddleX?"left":"right";
    if(!result.hidden)show(lastMissSide);
  });
  new MutationObserver(()=>{if(result.hidden)hide();else if(lastMissSide)show(lastMissSide);else hide()}).observe(result,{attributes:true,attributeFilter:["hidden"]});
  window.AnimalPrismBreakersDirectionalRehearsal=Object.freeze({gameVersion:GAME_VERSION,getState:()=>({side:lastMissSide,visible:!cue.hidden,open:details.open})});
})();
