(()=>{
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(false), node: document.body,
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

  const palette=["#ec6868","#489ee9","#9b72d5","#efb935","#67b66a","#35b8ad"];
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const storeKey="wp-animal-color-link-v1";
  const $=selector=>document.querySelector(selector);
  const screens=[...document.querySelectorAll(".screen")];
  const interfaceCopy={
    en:["Stages","Previous gardens","Next gardens","Pause this garden?","Continue keeps every path exactly in place. Returning to Stages ends this attempt.","Continue","Return to Stages","Next garden","Play again"],
    "zh-Hant":["關卡","上一區花園","下一區花園","要暫停這座花園嗎？","繼續會保留每一條路徑；返回關卡會結束本次挑戰。","繼續","返回關卡","下一座花園","再玩一次"],
    "zh-Hans":["关卡","上一组花园","下一组花园","要暂停这座花园吗？","继续会保留每一条路径；返回关卡会结束本次挑战。","继续","返回关卡","下一座花园","再玩一次"],
    ja:["ステージ","前のガーデン","次のガーデン","このガーデンを一時停止しますか？","続けるとすべての道がそのまま残ります。ステージに戻ると今回の挑戦は終了します。","続ける","ステージに戻る","次のガーデン","もう一度"],
    ko:["스테이지","이전 정원","다음 정원","이 정원을 일시정지할까요?","계속하면 모든 길이 그대로 유지됩니다. 스테이지로 돌아가면 이번 도전이 끝납니다.","계속하기","스테이지로 돌아가기","다음 정원","다시 하기"],
    es:["Niveles","Jardines anteriores","Jardines siguientes","¿Pausar este jardín?","Continuar conserva cada camino exactamente. Volver a Niveles termina este intento.","Continuar","Volver a Niveles","Siguiente jardín","Jugar de nuevo"],
    "pt-BR":["Fases","Jardins anteriores","Próximos jardins","Pausar este jardim?","Continuar mantém todos os caminhos no lugar. Voltar às Fases encerra esta tentativa.","Continuar","Voltar às Fases","Próximo jardim","Jogar novamente"],
    fr:["Niveaux","Jardins précédents","Jardins suivants","Mettre ce jardin en pause ?","Continuer conserve chaque chemin. Revenir aux niveaux termine cette tentative.","Continuer","Revenir aux niveaux","Jardin suivant","Rejouer"],
    de:["Stufen","Vorherige Gärten","Nächste Gärten","Diesen Garten pausieren?","Beim Fortsetzen bleiben alle Wege erhalten. Zurück zu den Stufen beendet diesen Versuch.","Fortsetzen","Zurück zu den Stufen","Nächster Garten","Erneut spielen"],
    it:["Livelli","Giardini precedenti","Giardini successivi","Mettere in pausa questo giardino?","Continuando, ogni percorso resta al suo posto. Tornare ai livelli termina il tentativo.","Continua","Torna ai livelli","Giardino successivo","Gioca ancora"],
    ru:["Уровни","Предыдущие сады","Следующие сады","Приостановить этот сад?","Продолжение сохранит все дорожки. Возврат к уровням завершит эту попытку.","Продолжить","Вернуться к уровням","Следующий сад","Играть снова"],
    hi:["स्तर","पिछले बगीचे","अगले बगीचे","इस बगीचे को रोकें?","जारी रखने पर हर रास्ता वैसा ही रहेगा। स्तरों पर लौटने से यह प्रयास समाप्त होगा।","जारी रखें","स्तरों पर लौटें","अगला बगीचा","फिर खेलें"],
    ar:["المراحل","الحدائق السابقة","الحدائق التالية","إيقاف هذه الحديقة مؤقتًا؟","المتابعة تُبقي كل مسار في مكانه. الرجوع إلى المراحل ينهي هذه المحاولة.","متابعة","العودة إلى المراحل","الحديقة التالية","العب مجددًا"]
  };
  const marketComparisonCopy={
    en:{heading:"Similar gameplay references",body:"Flow Free and Color Link Garden both ask you to connect matching colors without crossing paths and fill the whole board. Flow Free offers more than 2,000 puzzles plus Free Play and Time Trial modes. Color Link Garden instead uses 30 authored gardens that grow from 5×5 with four colors to 7×7 with six colors, with no timer and with Hint, Undo and Reset for recovery. Choose this game for a short stage-by-stage garden campaign with browser-local unlocks, not as a reproduction of Flow Free's puzzle library or timed modes.",disclaimer:"These are separate works. This comparison does not indicate an official edition, endorsement or partnership.",sourceLabel:"Official Flow Free reference"},
    "zh-Hant":{heading:"相似玩法參考",body:"Flow Free 與《彩色連線花園》都要把相同顏色連起來、避免路線交叉，並填滿整個盤面。Flow Free 提供超過 2,000 個謎題，以及自由遊玩與計時模式；《彩色連線花園》則是 30 座固定設計的花園，從四種顏色的 5×5 逐步成長到六種顏色的 7×7，沒有計時限制，並提供提示、復原與重設協助修正路線。適合想玩短篇逐關花園流程與瀏覽器本機解鎖進度的玩家，而不是尋找 Flow Free 題庫或計時模式的重製版。",disclaimer:"這是不同作品之間的玩法比較，不表示本站提供官方版本、獲得背書或與其合作。",sourceLabel:"Flow Free 官方說明"},
    "zh-Hans":{heading:"相似玩法参考",body:"Flow Free 与《彩色连线花园》都要求连接相同颜色、避免路线交叉，并填满整个棋盘。Flow Free 提供超过 2,000 个谜题，以及自由游玩和计时模式；《彩色连线花园》则是 30 座固定设计的花园，从四种颜色的 5×5 逐步增加到六种颜色的 7×7，不设倒计时，并提供提示、撤销和重置来修正路线。适合想玩短篇逐关花园流程与浏览器本地解锁进度的玩家，而不是寻找 Flow Free 题库或计时模式的重制版。",disclaimer:"这是不同作品之间的玩法比较，不表示本站提供官方版本、获得背书或与其合作。",sourceLabel:"Flow Free 官方说明"},
    ja:{heading:"似た遊び方の参考",body:"Flow Free と Color Link Garden は、同じ色をつなぎ、経路を交差させず、盤面全体を埋める点が共通しています。Flow Free は2,000以上のパズルに加え、Free Play と Time Trial を提供します。一方 Color Link Garden は、4色の5×5から6色の7×7へ進む30個の固定ガーデンで構成され、制限時間はなく、ヒント、元に戻す、リセットで経路を修正できます。Flow Free の大量の問題集やタイム制モードの再現ではなく、短いステージ制のガーデンキャンペーンとブラウザ内の解放進行を楽しみたい人向けです。",disclaimer:"これは別作品同士のゲーム性比較であり、公式版、推奨、提携を示すものではありません。",sourceLabel:"Flow Free 公式情報"},
    ko:{heading:"비슷한 플레이 참고",body:"Flow Free와 Color Link Garden은 같은 색을 연결하고 길이 서로 교차하지 않게 하며 보드 전체를 채운다는 핵심을 공유합니다. Flow Free는 2,000개가 넘는 퍼즐과 Free Play, Time Trial 모드를 제공합니다. Color Link Garden은 대신 4색 5×5에서 6색 7×7까지 커지는 30개의 고정 정원으로 구성되며 시간 제한이 없고 힌트, 실행 취소, 초기화로 길을 고칠 수 있습니다. Flow Free의 대규모 퍼즐 모음이나 시간제 모드를 재현한 것이 아니라 짧은 스테이지형 정원 캠페인과 브라우저 로컬 해금을 원하는 플레이어를 위한 게임입니다.",disclaimer:"서로 다른 작품의 플레이 방식을 비교한 내용이며, 공식판·추천·제휴를 의미하지 않습니다.",sourceLabel:"Flow Free 공식 정보"},
    es:{heading:"Referencias de jugabilidad similar",body:"Flow Free y Color Link Garden comparten la idea de unir colores iguales sin cruzar caminos y llenar todo el tablero. Flow Free ofrece más de 2.000 puzles, además de Free Play y Time Trial. Color Link Garden usa 30 jardines diseñados de antemano que avanzan de 5×5 con cuatro colores a 7×7 con seis, sin temporizador y con Pista, Deshacer y Reiniciar para corregir rutas. Elige este juego si prefieres una campaña corta por etapas con desbloqueos guardados en el navegador, no una reproducción de la biblioteca de puzles ni de los modos contrarreloj de Flow Free.",disclaimer:"Son obras independientes. Esta comparación no indica una edición oficial, una recomendación ni una colaboración.",sourceLabel:"Referencia oficial de Flow Free"},
    "pt-BR":{heading:"Referências de jogabilidade semelhante",body:"Flow Free e Color Link Garden compartilham a ideia de ligar cores iguais sem cruzar caminhos e preencher todo o tabuleiro. Flow Free oferece mais de 2.000 quebra-cabeças, além dos modos Free Play e Time Trial. Color Link Garden usa 30 jardins planejados que evoluem de 5×5 com quatro cores para 7×7 com seis, sem cronômetro e com Dica, Desfazer e Reiniciar para corrigir rotas. Escolha este jogo se preferir uma campanha curta por fases com desbloqueios salvos no navegador, não uma reprodução da biblioteca de desafios ou dos modos cronometrados de Flow Free.",disclaimer:"São obras independentes. Esta comparação não indica edição oficial, endosso ou parceria.",sourceLabel:"Referência oficial de Flow Free"},
    fr:{heading:"Références de gameplay similaire",body:"Flow Free et Color Link Garden partagent le principe de relier les couleurs identiques sans croiser les chemins et de remplir tout le plateau. Flow Free propose plus de 2 000 puzzles ainsi que les modes Free Play et Time Trial. Color Link Garden comprend plutôt 30 jardins conçus à l'avance, allant d'une grille 5×5 à quatre couleurs à une grille 7×7 à six couleurs, sans chronomètre, avec Indice, Annuler et Réinitialiser pour corriger un tracé. Choisissez ce jeu pour une courte campagne par étapes avec progression locale dans le navigateur, et non comme reproduction de la bibliothèque de puzzles ou des modes chronométrés de Flow Free.",disclaimer:"Il s'agit d'œuvres distinctes. Cette comparaison n'indique aucune édition officielle, approbation ou collaboration.",sourceLabel:"Référence officielle de Flow Free"},
    de:{heading:"Ähnliche Spielmechanik als Referenz",body:"Flow Free und Color Link Garden teilen das Ziel, gleiche Farben ohne sich kreuzende Wege zu verbinden und das gesamte Spielfeld zu füllen. Flow Free bietet mehr als 2.000 Rätsel sowie Free Play und Time Trial. Color Link Garden besteht stattdessen aus 30 gestalteten Gärten, die von 5×5 mit vier Farben bis 7×7 mit sechs Farben wachsen, ohne Zeitlimit und mit Hinweis, Rückgängig und Zurücksetzen zur Korrektur von Wegen. Dieses Spiel richtet sich an Spieler, die eine kurze stufenbasierte Gartenkampagne mit lokal im Browser gespeicherten Freischaltungen möchten, nicht an eine Nachbildung der Rätselbibliothek oder Zeitmodi von Flow Free.",disclaimer:"Es handelt sich um getrennte Werke. Dieser Vergleich bedeutet keine offizielle Ausgabe, Empfehlung oder Partnerschaft.",sourceLabel:"Offizielle Flow-Free-Referenz"},
    it:{heading:"Riferimenti con gameplay simile",body:"Flow Free e Color Link Garden condividono l'obiettivo di collegare colori uguali senza incrociare i percorsi e riempire l'intera griglia. Flow Free offre più di 2.000 rompicapi, oltre alle modalità Free Play e Time Trial. Color Link Garden propone invece 30 giardini progettati che crescono da 5×5 con quattro colori a 7×7 con sei, senza timer e con Suggerimento, Annulla e Ripristina per correggere i percorsi. Scegli questo gioco se preferisci una breve campagna a livelli con sblocchi salvati nel browser, non una riproduzione della raccolta di puzzle o delle modalità a tempo di Flow Free.",disclaimer:"Sono opere separate. Questo confronto non indica un'edizione ufficiale, un'approvazione o una collaborazione.",sourceLabel:"Riferimento ufficiale di Flow Free"},
    ru:{heading:"Похожие игровые механики",body:"Flow Free и Color Link Garden объединяет задача соединять одинаковые цвета без пересечения линий и заполнять всё поле. Flow Free предлагает более 2 000 головоломок, а также режимы Free Play и Time Trial. Color Link Garden вместо этого содержит 30 заранее созданных садов: от поля 5×5 с четырьмя цветами до 7×7 с шестью, без таймера и с Подсказкой, Отменой и Сбросом для исправления маршрута. Эта игра подходит тем, кто хочет короткую поэтапную садовую кампанию с локальными разблокировками в браузере, а не копию библиотеки уровней или режимов на время из Flow Free.",disclaimer:"Это разные произведения. Сравнение не означает официальную версию, одобрение или партнёрство.",sourceLabel:"Официальная информация Flow Free"},
    hi:{heading:"मिलते-जुलते गेमप्ले का संदर्भ",body:"Flow Free और Color Link Garden दोनों में समान रंगों को बिना रास्ते काटे जोड़ना और पूरा बोर्ड भरना मुख्य लक्ष्य है। Flow Free में 2,000 से अधिक पहेलियाँ तथा Free Play और Time Trial मोड हैं। Color Link Garden में इसके बजाय 30 तय बगीचे हैं, जो चार रंगों वाले 5×5 से छह रंगों वाले 7×7 तक बढ़ते हैं; समय सीमा नहीं है और संकेत, पूर्ववत तथा रीसेट से रास्ता सुधारा जा सकता है। यह उन खिलाड़ियों के लिए है जो ब्राउज़र में स्थानीय अनलॉक के साथ छोटा चरण-दर-चरण बगीचा अभियान चाहते हैं, Flow Free की बड़ी पहेली लाइब्रेरी या समयबद्ध मोड की नकल नहीं।",disclaimer:"ये अलग-अलग कृतियाँ हैं। यह तुलना किसी आधिकारिक संस्करण, समर्थन या साझेदारी का संकेत नहीं देती।",sourceLabel:"Flow Free का आधिकारिक संदर्भ"},
    ar:{heading:"مراجع لألعاب بآليات مشابهة",body:"تشترك Flow Free وColor Link Garden في وصل الألوان المتطابقة من دون تقاطع المسارات وملء اللوحة كاملة. تقدم Flow Free أكثر من 2000 لغز إلى جانب وضعي Free Play وTime Trial. أما Color Link Garden فتقدم 30 حديقة مصممة مسبقاً تتدرج من 5×5 بأربعة ألوان إلى 7×7 بستة ألوان، من دون مؤقت، مع التلميح والتراجع وإعادة الضبط لتصحيح المسارات. اختر هذه اللعبة إذا أردت حملة حدائق قصيرة على مراحل مع فتح التقدم محلياً في المتصفح، لا نسخة من مكتبة ألغاز Flow Free أو أوضاعها المحددة بالوقت.",disclaimer:"هذان عملان منفصلان. لا تعني هذه المقارنة وجود إصدار رسمي أو تأييد أو شراكة.",sourceLabel:"مرجع Flow Free الرسمي"}
  };
  document.body.setAttribute("data-runtime-localize","off");
  let locale=readStore("wp-locale")||"en";
  if(!localeOrder.includes(locale))locale="en";
  let unlocked=Number(readStore(storeKey))||1;
  let selected=Math.min(unlocked,30)-1;
  let level=null,paths={},active=null,history=[],moves=0,blockedPulse=false,resultClaimed=false;

  function readStore(key){try{return localStorage.getItem(key)}catch{return null}}
  function writeStore(key,value){try{localStorage.setItem(key,value)}catch{}}
  function text(key,vars={}){
    let value=window.COLOR_LINK_LOCALES[locale]?.[key]??window.COLOR_LINK_LOCALES.en[key]??key;
    return typeof value==="string"?value.replace(/\{(\w+)\}/g,(_,name)=>vars[name]??""):value;
  }
  function ui(index){return(interfaceCopy[locale]||interfaceCopy.en)[index]}
  function renderMarketComparison(){
    const sections=document.querySelector("#main .game-info-sections");
    if(!sections)return;
    const copy=marketComparisonCopy[locale]||marketComparisonCopy.en;
    let article=sections.querySelector("[data-wp-market-comparison]");
    if(!article){
      article=document.createElement("article");
      article.className="game-info-section";
      article.dataset.wpMarketComparison="1.3.0";
      article.setAttribute("data-runtime-localize","off");
      article.innerHTML='<h3></h3><div class="game-info-tags"><span><bdi>Flow Free</bdi></span></div><p data-wp-market-body></p><p data-wp-market-disclaimer></p><p><a data-wp-market-source href="https://www.bigduckgames.com/flowfree" rel="noopener noreferrer"></a></p>';
      sections.append(article);
    }
    article.dataset.comparisonLocale=locale;
    article.querySelector("h3").textContent=copy.heading;
    article.querySelector("[data-wp-market-body]").textContent=copy.body;
    article.querySelector("[data-wp-market-disclaimer]").textContent=copy.disclaimer;
    article.querySelector("[data-wp-market-source]").textContent=copy.sourceLabel;
  }
  function setBattleCovered(covered,owner){
    [...$("#battle").children].forEach(node=>{if(node!==owner)node.inert=covered});
  }
  function closeBattleModal(panel,focusTarget){
    panel.hidden=true;
    setBattleCovered(false,panel);
    focusTarget?.focus?.({preventScroll:true});
  }
  function openBattleModal(panel,focusTarget){
    setBattleCovered(true,panel);
    panel.hidden=false;
    requestAnimationFrame(()=>focusTarget?.focus?.({preventScroll:true}));
  }
  function show(id){
    (__wpNotifyMeasurement(), $("#leavePanel").hidden=true);
    (__wpNotifyMeasurement(), $("#result").hidden=true);
    setBattleCovered(false,null);
    screens.forEach(screen=>screen.hidden=screen.id!==id);
    document.body.dataset.screen=id;
    if(id==="battle"){
      window.dispatchEvent(new Event("weightplay:stage-sync"));
      window.dispatchEvent(new Event("weightplay:battle-sync"));
    }else{
      window.dispatchEvent(new Event("weightplay:battle-sync"));
      window.dispatchEvent(new Event("weightplay:stage-sync"));
    }
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    if(id==="stage")renderStages();

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[id] ?? null;
      if (["result"].includes(id) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  const {levels,buildLevel}=window.COLOR_LINK_LEVELS;
  function renderStages(){
    $("#progressBadge").textContent=text("progress",{done:Math.min(unlocked-1,30)});
    $("#stageGrid").innerHTML="";
    levels.forEach((item,index)=>{
      const button=document.createElement("button");
      const locked=index+1>unlocked;
      button.className=`stage-card${index===selected?" selected":""}${locked?" locked":""}`;
      button.disabled=locked;
      button.dataset.index=index;
      button.classList.toggle("is-centered",index===selected);
      if(index===selected){button.setAttribute("aria-current","true");button.dataset.wpStageRecommended="true"}
      button.innerHTML=`<strong>${text("garden",{n:index+1})}</strong><span>${item.size} × ${item.size}</span><span class="dots">${palette.slice(0,item.count).map(c=>`<i style="--c:${c}"></i>`).join("")}</span>`;
      button.setAttribute("aria-label",`${text("garden",{n:index+1})}, ${item.size} × ${item.size}${locked?", "+text("locked"):""}`);
      button.onclick=()=>startLevel(index);
      $("#stageGrid").append(button);
    });
    requestAnimationFrame(()=>$("#stageGrid .selected")?.scrollIntoView({block:"nearest",inline:"center"}));
  }
  function startLevel(index){
    selected=index;level=levels[index];paths={};active=null;history=[];moves=0;blockedPulse=false;
    $("#grid").style.setProperty("--size",level.size);
    $("#chapter").textContent=`${level.size} × ${level.size}`;
    $("#stageName").textContent=text("garden",{n:index+1});
    $("#status").textContent=text("draw");
    show("battle");renderBoard();

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function endpointAt(cell){
    for(const[color,pair]of Object.entries(level.ends))if(pair.includes(cell))return Number(color);
    return null;
  }
  function ownerAt(cell,includeActive=true){
    for(const[color,path]of Object.entries(paths))if(path.includes(cell))return Number(color);
    if(includeActive&&active?.cells.includes(cell))return active.color;
    return null;
  }
  function adjacent(a,b){
    const ar=Math.floor(a/level.size),ac=a%level.size,br=Math.floor(b/level.size),bc=b%level.size;
    return Math.abs(ar-br)+Math.abs(ac-bc)===1;
  }
  function renderBoard(){
    const grid=$("#grid");grid.innerHTML="";
    for(let i=0;i<level.size*level.size;i++){
      const color=ownerAt(i),endpoint=endpointAt(i),button=document.createElement("button");
      button.className=`cell${color!==null?" path":""}${active?.cells.includes(i)?" active":""}`;
      button.dataset.cell=i;button.setAttribute("role","gridcell");
      if(color!==null)button.style.setProperty("--color",palette[color]);
      else if(endpoint!==null)button.style.setProperty("--color",palette[endpoint]);
      const row=Math.floor(i/level.size)+1,col=i%level.size+1;
      button.setAttribute("aria-label",endpoint!==null?text("seed",{color:text("colors")[endpoint],row,col}):text("cell",{row,col}));
      if(endpoint!==null){const dot=document.createElement("span");dot.className="dot";button.append(dot)}
      grid.append(button);
    }
    const linked=Object.keys(paths).length;
    const filled=new Set(Object.values(paths).flat()).size;
    $("#moves").textContent=text("moves",{n:moves});
    $("#linkStatus").textContent=text("links",{done:linked,total:level.count});
    $("#fillStatus").textContent=text("filled",{done:filled,total:level.size*level.size});
    $("#undo").disabled=!history.length;
  }
  function begin(cell,pointerId){
    const color=endpointAt(cell);if(color===null)return;
    if(paths[color]){delete paths[color];history=history.filter(value=>value!==color)}
    active={color,cells:[cell],target:level.ends[color].find(end=>end!==cell),pointerId};
    moves++;renderBoard();
  }
  function extend(cell){
    if(!active)return;
    const path=active.cells,last=path.at(-1);
    if(cell===last)return;
    if(path.length>1&&cell===path.at(-2)){path.pop();renderBoard();return}
    const endpoint=endpointAt(cell);
    if(!adjacent(last,cell)||active.cells.includes(cell)||ownerAt(cell,false)!==null||(endpoint!==null&&cell!==active.target)){
      if(!blockedPulse){blockedPulse=true;$("#status").textContent=text("blocked");setTimeout(()=>blockedPulse=false,250)}
      return;
    }
    path.push(cell);renderBoard();
  }
  function finish(){
    if(!active)return;
    if(active.cells.at(-1)===active.target){
      paths[active.color]=active.cells.slice();
      history=history.filter(value=>value!==active.color);history.push(active.color);
      $("#status").textContent=text("continue");
    }else $("#status").textContent=text("miss");
    active=null;renderBoard();checkComplete();
  }
  function checkComplete(){
    const cells=new Set(Object.values(paths).flat());
    if(Object.keys(paths).length!==level.count||cells.size!==level.size*level.size)return;
    if(selected+2>unlocked){unlocked=Math.min(31,selected+2);writeStore(storeKey,String(unlocked))}
    playTone("puzzle.clear",.08);setTimeout(()=>void 0,90);
    $("#resultBody").textContent=text("resultBody",{n:selected+1,moves});
    resultClaimed=false;
    $("#next").disabled=selected===29;
    [$("#resultStages"),$("#next"),$("#retry")].forEach(button=>button.classList.remove("primary"));
    (__wpNotifyMeasurement(), (selected===29?$("#resultStages"):$("#next")).classList.add("primary"));
    setTimeout(()=>openBattleModal($("#result"),selected===29?$("#resultStages"):$("#next")),220);

    __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function playTone(cue = "ui.click") { return window.WeightPlayAudio?.play(cue); }
  function hint(){
    const unresolved=Object.keys(level.solution).map(Number).find(color=>!paths[color]);
    if(unresolved===undefined)return;
    const needed=new Set(level.solution[unresolved]);
    Object.entries(paths).forEach(([color,path])=>{if(path.some(cell=>needed.has(cell))){delete paths[color];history=history.filter(value=>value!==Number(color))}});
    paths[unresolved]=level.solution[unresolved].slice();history.push(unresolved);moves++;
    $("#status").textContent=text("hinted");renderBoard();
    level.solution[unresolved].forEach(cell=>gridCell(cell)?.classList.add("hint"));
    checkComplete();
  }
  const gridCell=cell=>document.querySelector(`[data-cell="${cell}"]`);
  function applyLocale(){
    const pack=window.COLOR_LINK_LOCALES[locale];
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    document.title=`${pack.title} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node=>node.textContent=text(node.dataset.t));
    document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",text(node.dataset.tAria)));
    document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",text(node.dataset.tAlt)));
    $("#locale").value=locale;
    $("#stageTab").textContent=ui(0);
    $("#previousGroup").setAttribute("aria-label",ui(1));
    $("#nextGroup").setAttribute("aria-label",ui(2));
    $("#leaveTitle").textContent=ui(3);
    $("#leaveText").textContent=ui(4);
    $("#leaveContinue").textContent=ui(5);
    $("#leaveStages").textContent=ui(6);
    $("#resultStages").textContent=ui(0);
    $("#next").textContent=ui(7);
    $("#retry").textContent=ui(8);
    renderMarketComparison();
    if(!$("#stage").hidden)renderStages();
    if(!$("#battle").hidden){$("#stageName").textContent=text("garden",{n:selected+1});$("#status").textContent=text("draw");renderBoard()}
  }
  localeOrder.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=window.COLOR_LINK_LOCALES[code].label;$("#locale").append(option)});
  $("#locale").onchange=event=>{locale=event.target.value;writeStore("wp-locale",locale);applyLocale()};
  $("#start").onclick=()=>show("stage");
  $("#stage [data-back]").onclick=()=>show("main");
  $("#battle [data-back]").onclick=()=>{
    if(!$("#result").hidden){$("#resultStages").click();return}
    openBattleModal($("#leavePanel"),$("#leaveContinue"));
  };
  $("#leaveContinue").onclick=()=>closeBattleModal($("#leavePanel"),$("#battle [data-back]"));
  $("#leaveStages").onclick=()=>show("stage");
  $("#stageGrid").addEventListener("wonder:stage-snap",event=>{
    const index=Number(event.detail?.index);
    const card=$("#stageGrid").children[index];
    if(!Number.isInteger(index)||!card)return;
    if(!card.disabled)selected=index;
    $("#stageGrid").querySelectorAll(".stage-card").forEach((item,itemIndex)=>{
      item.classList.toggle("selected",itemIndex===index);
      item.classList.toggle("is-centered",itemIndex===index);
      item.toggleAttribute("aria-current",itemIndex===index);
    });
  });
  function scrollToGroup(delta){
    const index=Math.max(0,Math.min(29,Math.floor(selected/10)*10+delta*10));
    const card=$("#stageGrid").children[index];
    card?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
  }
  $("#previousGroup").onclick=()=>scrollToGroup(-1);
  $("#nextGroup").onclick=()=>scrollToGroup(1);
  $("#stageTab").onclick=()=>$("#stageGrid").children[selected]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
  $("#undo").onclick=()=>{const color=history.pop();if(color!==undefined)delete paths[color];active=null;$("#status").textContent=text("undone");renderBoard()};
  $("#reset").onclick=()=>{paths={};active=null;history=[];moves=0;$("#status").textContent=text("fresh");renderBoard()};
  $("#hint").onclick=hint;
  function claimResult(action){
    if(resultClaimed)return;
    resultClaimed=true;
    closeBattleModal($("#result"));
    action();
  }
  $("#resultStages").onclick=()=>claimResult(()=>show("stage"));
  $("#retry").onclick=()=>claimResult(()=>__wpReplayStart(() => startLevel(selected)));
  $("#next").onclick=()=>{if(!$("#next").disabled)claimResult(()=>startLevel(selected+1))};
  $("#grid").addEventListener("pointerdown",event=>{const cell=event.target.closest(".cell");if(!cell)return;event.preventDefault();$("#grid").setPointerCapture?.(event.pointerId);begin(Number(cell.dataset.cell),event.pointerId)});
  $("#grid").addEventListener("pointermove",event=>{if(!active)return;const cell=document.elementFromPoint(event.clientX,event.clientY)?.closest(".cell");if(cell)extend(Number(cell.dataset.cell))});
  $("#grid").addEventListener("pointerup",finish);
  $("#grid").addEventListener("pointercancel",finish);
  $("#grid").addEventListener("keydown",event=>{
    const focused=document.activeElement.closest?.(".cell"),start=focused?Number(focused.dataset.cell):null;
    if(event.key==="Enter"||event.key===" "){event.preventDefault();if(active)finish();else if(start!==null)begin(start,null);return}
    if(!active)return;
    const delta={ArrowUp:-level.size,ArrowDown:level.size,ArrowLeft:-1,ArrowRight:1}[event.key];
    if(delta===undefined)return;event.preventDefault();
    const next=active.cells.at(-1)+delta;
    if(next>=0&&next<level.size*level.size&&adjacent(active.cells.at(-1),next))extend(next);
  });
  document.addEventListener("keydown",event=>{
    const panel=!$("#leavePanel").hidden?$("#leavePanel"):!$("#result").hidden?$("#result"):null;
    if(!panel)return;
    if(event.key==="Escape"){
      event.preventDefault();
      (panel===$("#leavePanel")?$("#leaveContinue"):$("#resultStages")).click();
      return;
    }
    if(event.key!=="Tab")return;
    const controls=[...panel.querySelectorAll("button:not([disabled])")];
    const first=controls[0],last=controls.at(-1);
    if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  },true);
  applyLocale();show("main");
  window.__COLOR_LINK_TEST__={levels,buildLevel,interfaceCopy,marketComparisonCopy};
})();