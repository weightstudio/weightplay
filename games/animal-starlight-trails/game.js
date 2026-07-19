(() => {
  "use strict";

  const GAME_ID = "animal-starlight-trails";
  const SAVE_KEY = "weightplay_animal_starlight_trails_v1";
  const LOCALE_KEY = "weightPlayLocale";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const EN = {
    title:"Animal Starlight Trails",language:"Language",eyebrow:"Moon Cap Orla's constellation workshop",pitch:"Trace every trail exactly once and relight the Animal Star Map.",start:"Start Game",chooseStage:"Choose Constellation",stage:"Stage",trails:"Trails",stars:"Stars",undo:"Undo",restart:"Restart",hint:"Hint",retry:"Retry",stages:"Stages",next:"Next Stage",skillReport:"Skill Report",loading:"Loading star map…",progress:"{cleared} / 30 constellations restored",bestStars:"{stars} stars collected",ready:"Choose a star to begin.",continue:"Continue from the glowing star.",deadEnd:"That route cannot reach every remaining trail. Undo or restart.",wrongStart:"Begin on the glowing start seal.",usedTrail:"That trail has already been used.",notConnected:"Choose a star connected to the glowing star.",wrongWay:"That comet trail only flows in the arrow direction.",checkpoint:"Reach numbered star {number} next.",gateLocked:"Find the golden key star before crossing this gate.",keyFound:"The golden star gate is open!",complete:"Constellation restored!",hintStart:"Try beginning on the highlighted star.",hintNext:"A route-safe next star is highlighted.",assist:"{hints} hints · {mistakes} corrections",resultTitle:"Trail Restored",resultText:"You lit all {edges} trails in {time}.",newBest:"New best time for this constellation!",previousBest:"Best time: {time}",logic:"Logic",focus:"Focus",problem:"Problem Solving",logicValue:"{edges} trails planned",focusValue:"{mistakes} corrections",problemValue:"{hints} hints used",chapter1:"Open Star Paths",chapter2:"Starting Seals",chapter3:"Comet Arrows",chapter4:"Numbered Stars",chapter5:"Keys and Gates",chapter6:"Grand Constellations",rule1:"Use every trail exactly once. Stars may be revisited.",rule2:"Begin at the marked star, then use every trail once.",rule3:"Follow every violet comet trail in its arrow direction.",rule4:"Reach the numbered star seals in order.",rule5:"Touch the golden key star before crossing the rose gate.",rule6:"Combine start seals, arrows, star order, keys, and gates.",locked:"Locked",cleared:"Cleared",available:"Available",chapter:"Observatory {number}",stageSummary:"{cleared} cleared · {stars} stars",ruleClassic:"Classic",ruleStart:"Start seal",ruleArrow:"Comet arrows",ruleOrder:"Star order",ruleGate:"Star gate",ruleMaster:"Mastery",node:"Star {number}",startNode:"Start star {number}",keyNode:"Key star {number}",checkpointNode:"Numbered star {order}",edgeLabel:"Trail from star {from} to star {to}" 
  };

  const STRINGS = {
    en: EN,
    "zh-Hant": {...EN,title:"動物星光一筆畫",language:"語言",eyebrow:"月帽奧拉的星座工坊",pitch:"每條星路只能走一次，一筆修復完整動物星圖。",start:"開始遊戲",chooseStage:"選擇星座",stage:"關卡",trails:"星路",stars:"星星",undo:"上一步",restart:"重新開始",hint:"提示",retry:"再試一次",stages:"關卡",next:"下一關",skillReport:"技能報告",loading:"載入星圖中…",progress:"已修復 {cleared} / 30 個星座",bestStars:"已收集 {stars} 顆星",ready:"選一顆星開始。",continue:"從發亮的星星繼續。",deadEnd:"這條路無法走完剩餘星路，請上一步或重新開始。",wrongStart:"請從發亮的起點星印開始。",usedTrail:"這條星路已經走過了。",notConnected:"請選擇與目前星星相連的星星。",wrongWay:"這條彗星路只能依箭頭方向通過。",checkpoint:"下一個要抵達編號 {number} 星印。",gateLocked:"先找到金色鑰匙星，才能通過星門。",keyFound:"金色星門已開啟！",complete:"星座修復完成！",hintStart:"可以嘗試從發亮的星星開始。",hintNext:"已標示一個能繼續完成的下一步。",assist:"{hints} 次提示 · {mistakes} 次修正",resultTitle:"星路修復完成",resultText:"你用 {time} 點亮了全部 {edges} 條星路。",newBest:"這個星座的新最佳時間！",previousBest:"最佳時間：{time}",logic:"邏輯",focus:"專注",problem:"問題解決",logicValue:"規劃 {edges} 條星路",focusValue:"{mistakes} 次修正",problemValue:"使用 {hints} 次提示",chapter1:"開放星路",chapter2:"起點星印",chapter3:"彗星箭路",chapter4:"編號星印",chapter5:"鑰匙與星門",chapter6:"大星座考驗",rule1:"每條星路只能走一次，星星可以重複經過。",rule2:"從指定星印開始，再把全部星路走完。",rule3:"紫色彗星路必須依箭頭方向通過。",rule4:"依照數字順序抵達星印。",rule5:"先碰到金色鑰匙星，再通過玫紅色星門。",rule6:"綜合起點、箭頭、順序、鑰匙與星門。",locked:"未解鎖",cleared:"已完成",available:"可挑戰",chapter:"第 {number} 觀測台",stageSummary:"完成 {cleared} 關 · {stars} 顆星",ruleClassic:"經典星路",ruleStart:"起點星印",ruleArrow:"彗星箭路",ruleOrder:"星印順序",ruleGate:"鑰匙星門",ruleMaster:"綜合考驗",node:"第 {number} 顆星",startNode:"起點星 {number}",keyNode:"鑰匙星 {number}",checkpointNode:"編號 {order} 星印",edgeLabel:"第 {from} 顆星至第 {to} 顆星的星路"},
    "zh-Hans": {...EN,title:"动物星光一笔画",language:"语言",eyebrow:"月帽奥拉的星座工坊",pitch:"每条星路只能走一次，一笔修复完整动物星图。",start:"开始游戏",chooseStage:"选择星座",stage:"关卡",trails:"星路",stars:"星星",undo:"上一步",restart:"重新开始",hint:"提示",retry:"再试一次",stages:"关卡",next:"下一关",skillReport:"技能报告",loading:"加载星图中…",progress:"已修复 {cleared} / 30 个星座",bestStars:"已收集 {stars} 颗星",ready:"选择一颗星开始。",continue:"从发亮的星星继续。",deadEnd:"这条路无法走完剩余星路，请上一步或重新开始。",wrongStart:"请从发亮的起点星印开始。",usedTrail:"这条星路已经走过了。",notConnected:"请选择与当前星星相连的星星。",wrongWay:"这条彗星路只能按箭头方向通过。",checkpoint:"下一个要到达编号 {number} 星印。",gateLocked:"先找到金色钥匙星，才能通过星门。",keyFound:"金色星门已开启！",complete:"星座修复完成！",hintStart:"可以尝试从发亮的星星开始。",hintNext:"已标出一个能继续完成的下一步。",assist:"{hints} 次提示 · {mistakes} 次修正",resultTitle:"星路修复完成",resultText:"你用 {time} 点亮了全部 {edges} 条星路。",newBest:"这个星座的新最佳时间！",previousBest:"最佳时间：{time}",logic:"逻辑",focus:"专注",problem:"问题解决",chapter1:"开放星路",chapter2:"起点星印",chapter3:"彗星箭路",chapter4:"编号星印",chapter5:"钥匙与星门",chapter6:"大星座考验",rule1:"每条星路只能走一次，星星可以重复经过。",rule2:"从指定星印开始，再把全部星路走完。",rule3:"紫色彗星路必须按箭头方向通过。",rule4:"按照数字顺序到达星印。",rule5:"先碰到金色钥匙星，再通过玫红色星门。",rule6:"综合起点、箭头、顺序、钥匙与星门。"},
    ja: {...EN,title:"アニマル星空ひと筆",language:"言語",pitch:"すべての星の道を一度ずつ通って、動物星図を直そう。",start:"ゲーム開始",chooseStage:"星座を選ぶ",stage:"ステージ",trails:"道",stars:"スター",undo:"一手戻す",restart:"やり直す",hint:"ヒント",retry:"もう一度",stages:"ステージ",next:"次のステージ",skillReport:"スキルレポート",ready:"星を選んで始めよう。",deadEnd:"残りの道を全部通れません。一手戻すか、やり直してください。",wrongStart:"光るスタートの星から始めよう。",complete:"星座を修復しました！",chapter1:"ひらかれた星の道",chapter2:"スタートの印",chapter3:"彗星の矢印",chapter4:"番号の星",chapter5:"鍵とゲート",chapter6:"大星座チャレンジ",rule1:"すべての道を一度だけ通ります。星は何度通ってもかまいません。"},
    ko: {...EN,title:"동물 별빛 한붓그리기",language:"언어",pitch:"모든 별길을 한 번씩 지나 동물 별지도를 밝혀 주세요.",start:"게임 시작",chooseStage:"별자리 선택",stage:"스테이지",trails:"별길",stars:"별",undo:"되돌리기",restart:"다시 시작",hint:"힌트",retry:"다시 도전",stages:"스테이지",next:"다음 스테이지",skillReport:"플레이 리포트",ready:"시작할 별을 선택하세요.",deadEnd:"남은 별길을 모두 지날 수 없습니다. 되돌리거나 다시 시작하세요.",wrongStart:"빛나는 시작 별에서 출발하세요.",complete:"별자리를 복원했습니다!",chapter1:"열린 별길",chapter2:"시작 봉인",chapter3:"혜성 화살표",chapter4:"번호 별",chapter5:"열쇠와 문",chapter6:"대별자리 도전"},
    es: {...EN,title:"Senderos Estelares Animales",language:"Idioma",pitch:"Recorre cada sendero una sola vez y restaura el mapa estelar animal.",start:"Iniciar juego",chooseStage:"Elegir constelación",stage:"Nivel",trails:"Senderos",stars:"Estrellas",undo:"Deshacer",restart:"Reiniciar",hint:"Pista",retry:"Reintentar",stages:"Niveles",next:"Siguiente nivel",skillReport:"Informe de habilidades",ready:"Elige una estrella para empezar.",deadEnd:"Esta ruta no puede completar los senderos restantes. Deshaz o reinicia.",wrongStart:"Empieza en el sello brillante.",complete:"¡Constelación restaurada!",chapter1:"Rutas abiertas",chapter2:"Sellos de inicio",chapter3:"Flechas cometa",chapter4:"Estrellas numeradas",chapter5:"Llaves y puertas",chapter6:"Grandes constelaciones"},
    "pt-BR": {...EN,title:"Trilhas Estelares Animais",language:"Idioma",pitch:"Passe por cada trilha uma vez e restaure o mapa estelar animal.",start:"Iniciar jogo",chooseStage:"Escolher constelação",stage:"Fase",trails:"Trilhas",stars:"Estrelas",undo:"Desfazer",restart:"Reiniciar",hint:"Dica",retry:"Tentar de novo",stages:"Fases",next:"Próxima fase",skillReport:"Relatório de habilidades",ready:"Escolha uma estrela para começar.",deadEnd:"Esta rota não alcança todas as trilhas restantes. Desfaça ou reinicie.",wrongStart:"Comece no selo brilhante.",complete:"Constelação restaurada!",chapter1:"Trilhas abertas",chapter2:"Selos iniciais",chapter3:"Setas de cometa",chapter4:"Estrelas numeradas",chapter5:"Chaves e portões",chapter6:"Grandes constelações"},
    fr: {...EN,title:"Sentiers Animaliers Étoilés",language:"Langue",pitch:"Parcourez chaque sentier une seule fois et restaurez la carte des animaux.",start:"Commencer",chooseStage:"Choisir une constellation",stage:"Niveau",trails:"Sentiers",stars:"Étoiles",undo:"Annuler",restart:"Recommencer",hint:"Indice",retry:"Réessayer",stages:"Niveaux",next:"Niveau suivant",skillReport:"Rapport de compétences",ready:"Choisissez une étoile pour commencer.",deadEnd:"Cette route ne peut pas couvrir les sentiers restants. Annulez ou recommencez.",wrongStart:"Commencez sur le sceau lumineux.",complete:"Constellation restaurée !",chapter1:"Sentiers ouverts",chapter2:"Sceaux de départ",chapter3:"Flèches comètes",chapter4:"Étoiles numérotées",chapter5:"Clés et portes",chapter6:"Grandes constellations"},
    de: {...EN,title:"Tierische Sternenpfade",language:"Sprache",pitch:"Nutze jeden Pfad genau einmal und stelle die Tiersternkarte wieder her.",start:"Spiel starten",chooseStage:"Sternbild wählen",stage:"Stufe",trails:"Pfade",stars:"Sterne",undo:"Zurück",restart:"Neu starten",hint:"Hinweis",retry:"Erneut",stages:"Stufen",next:"Nächste Stufe",skillReport:"Fähigkeitenbericht",ready:"Wähle einen Startstern.",deadEnd:"Dieser Weg erreicht nicht alle übrigen Pfade. Gehe zurück oder starte neu.",wrongStart:"Beginne am leuchtenden Startsiegel.",complete:"Sternbild wiederhergestellt!",chapter1:"Offene Sternpfade",chapter2:"Startsiegel",chapter3:"Kometenpfeile",chapter4:"Nummerierte Sterne",chapter5:"Schlüssel und Tore",chapter6:"Große Sternbilder"},
    it: {...EN,title:"Sentieri Stellari Animali",language:"Lingua",pitch:"Percorri ogni sentiero una sola volta e ripristina la mappa animale.",start:"Inizia",chooseStage:"Scegli costellazione",stage:"Livello",trails:"Sentieri",stars:"Stelle",undo:"Annulla",restart:"Ricomincia",hint:"Suggerimento",retry:"Riprova",stages:"Livelli",next:"Livello successivo",skillReport:"Rapporto abilità",ready:"Scegli una stella per iniziare.",deadEnd:"Questo percorso non può coprire i sentieri rimasti. Annulla o ricomincia.",wrongStart:"Inizia dal sigillo luminoso.",complete:"Costellazione ripristinata!",chapter1:"Sentieri aperti",chapter2:"Sigilli iniziali",chapter3:"Frecce cometa",chapter4:"Stelle numerate",chapter5:"Chiavi e cancelli",chapter6:"Grandi costellazioni"},
    ru: {...EN,title:"Звёздные тропы животных",language:"Язык",pitch:"Пройдите каждую звёздную тропу один раз и восстановите карту животных.",start:"Начать игру",chooseStage:"Выбрать созвездие",stage:"Уровень",trails:"Тропы",stars:"Звёзды",undo:"Назад",restart:"Заново",hint:"Подсказка",retry:"Повторить",stages:"Уровни",next:"Следующий уровень",skillReport:"Отчёт навыков",ready:"Выберите начальную звезду.",deadEnd:"Этот маршрут не охватывает все оставшиеся тропы. Вернитесь или начните заново.",wrongStart:"Начните со светящейся звезды.",complete:"Созвездие восстановлено!",chapter1:"Открытые тропы",chapter2:"Стартовые печати",chapter3:"Стрелы комет",chapter4:"Нумерованные звёзды",chapter5:"Ключи и ворота",chapter6:"Большие созвездия"}
  };

  let locale = localStorage.getItem(LOCALE_KEY) || "en";
  if (!STRINGS[locale]) locale = "en";
  const format = (text, vars={}) => String(text).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
  const t = (key, vars) => format(STRINGS[locale]?.[key] ?? EN[key] ?? key, vars);

  const TEMPLATES = [
    {p:[[14,58],[38,30],[63,58],[86,27]],r:[0,1,2,3]},
    {p:[[22,26],[76,26],[76,74],[22,74]],r:[0,1,2,3,0]},
    {p:[[20,68],[80,68],[76,30],[24,30],[50,10]],r:[0,1,2,3,0,4,1]},
    {p:[[15,50],[50,16],[85,50],[50,84],[50,50]],r:[0,1,2,3,0,4,2]},
    {p:[[13,26],[44,14],[77,28],[68,72],[34,82],[50,50]],r:[0,1,2,3,4,1,3,5]},
    {p:[[14,24],[50,10],[84,25],[78,70],[24,74],[50,48]],r:[0,1,2,3,0,4,2,5,0]},
    {p:[[12,54],[28,18],[63,12],[87,42],[70,82],[26,84],[50,50]],r:[0,1,2,3,4,0,5,2,6,4]},
    {p:[[18,20],[52,10],[84,24],[82,70],[48,88],[16,68],[50,48]],r:[0,1,2,3,0,4,1,5,2,6,3]},
    {p:[[12,36],[35,10],[68,12],[88,40],[73,79],[38,88],[48,48],[18,70]],r:[0,1,2,3,4,0,5,2,6,4,7,1]},
    {p:[[15,22],[50,8],[84,24],[88,66],[54,88],[18,78],[48,44],[70,58]],r:[0,1,2,3,0,4,1,5,2,6,3,7,0]}
  ];

  function transformPoints(points, id) {
    const mirror = id % 2 === 0;
    const rotate = id % 3 === 0;
    return points.map(([x,y]) => {
      let nx = mirror ? 100 - x : x;
      let ny = y;
      if (rotate) [nx,ny] = [ny,100-nx];
      return [nx,ny];
    });
  }

  function checkpointNodes(route, count) {
    const unique = route.filter((node, index) => index > 0 && route.indexOf(node) === index);
    if (!unique.length) return [];
    const picks = [];
    for (let i=1;i<=count;i+=1) {
      const at = Math.min(unique.length-1, Math.max(0, Math.floor((unique.length*i)/(count+1))));
      if (!picks.includes(unique[at])) picks.push(unique[at]);
    }
    return picks;
  }

  function makeStage(id) {
    const chapter = Math.ceil(id/5);
    const templateIndex = chapter === 1 ? id-1 : Math.min(9, chapter + ((id-1)%5) - 1);
    const base = TEMPLATES[templateIndex];
    const route = [...base.r];
    const directedIndices = chapter >= 3 ? [...new Set([1, chapter >= 6 ? Math.max(2, route.length-4) : Math.max(2, Math.floor(route.length/2))])].filter(i => i < route.length-1) : [];
    const checkpoints = chapter >= 4 ? checkpointNodes(route, id%5===0 || chapter===6 ? 3 : 2) : [];
    const keyNode = chapter >= 5 ? route[Math.min(2,route.length-1)] : null;
    const gateIndex = chapter >= 5 ? Math.max(3,route.length-3) : null;
    const ruleKey = chapter===1?"ruleClassic":chapter===2?"ruleStart":chapter===3?"ruleArrow":chapter===4?"ruleOrder":chapter===5?"ruleGate":"ruleMaster";
    const edges = route.slice(0,-1).map((from,index) => ({
      id:index,from,to:route[index+1],key:[from,route[index+1]].sort((a,b)=>a-b).join("-"),
      directed:directedIndices.includes(index),gate:gateIndex===index
    }));
    if (new Set(edges.map(edge=>edge.key)).size !== edges.length) throw new Error(`Stage ${id} repeats an edge.`);
    return {id,chapter,points:transformPoints(base.p,id),route,edges,forcedStart:chapter>=2?route[0]:null,directedIndices,checkpoints,keyNode,gateIndex,ruleKey};
  }

  const stages = Array.from({length:30},(_,index)=>makeStage(index+1));
  const defaultSave = () => ({unlocked:1,stars:Array(30).fill(0),bestTimes:Array(30).fill(null),cleared:Array(30).fill(false)});
  function loadSave(){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");return raw?{...defaultSave(),...raw}:defaultSave();}catch{return defaultSave();}}
  let save = loadSave();
  const persist = () => localStorage.setItem(SAVE_KEY,JSON.stringify(save));

  const dom = {
    loading:$("#loadingPanel"),loadingText:$("#loadingText"),loadingFill:$("#loadingFill"),main:$("#mainScreen"),guide:$(".game-page-info"),stage:$("#stageScreen"),battle:$("#battleScreen"),locale:$("#localeSelect"),mainProgress:$("#mainProgress"),start:$("#startBtn"),stageBack:$("#stageBackBtn"),stageRail:$("#stageRail"),stageSummary:$("#stageSummary"),chapterKicker:$("#chapterKicker"),chapterTitle:$("#chapterTitle"),chapterRule:$("#chapterRule"),battleBack:$("#battleBackBtn"),stageLabel:$("#stageLabel"),edgeProgress:$("#edgeProgress"),trailCount:$("#trailCount"),starTotal:$("#starTotal"),objective:$("#objectiveRow"),scene:$("#puzzleScene"),svg:$("#graphSvg"),feedback:$("#feedbackText"),feedbackRow:$(".battle-feedback"),assist:$("#assistText"),undo:$("#undoBtn"),restart:$("#restartBtn"),hint:$("#hintBtn"),result:$("#resultPanel"),resultTitle:$("#resultTitle"),resultStars:$("#resultStars"),resultText:$("#resultText"),skillGrid:$("#skillGrid"),comparison:$("#comparisonText"),retry:$("#retryBtn"),resultStages:$("#resultStagesBtn"),next:$("#nextBtn")
  };

  let stageIndex = Math.max(0,Math.min(29,save.unlocked-1));
  let path = [];
  let hints = 0;
  let mistakes = 0;
  let restarts = 0;
  let startedAt = 0;
  let activePointer = null;
  let hintNode = null;
  let completing = false;

  function sound(name){try{window.WonderSound?.play?.(name);}catch{}}
  function analytics(name,data={}){try{window.WonderAnalytics?.track?.(name,{game_id:GAME_ID,...data});}catch{}}
  function totalStars(){return save.stars.reduce((sum,value)=>sum+Number(value||0),0);}
  function clearedCount(){return save.cleared.filter(Boolean).length;}
  function formatTime(ms){const seconds=Math.max(0,Math.round(ms/1000));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;}

  function applyLocale() {
    document.documentElement.lang = locale;
    dom.locale.value = locale;
    localStorage.setItem(LOCALE_KEY,locale);
    $$('[data-i18n]').forEach(node => {node.textContent=t(node.dataset.i18n);});
    dom.loadingText.textContent=t("loading");
    updateMainProgress();
    if (!dom.stage.hidden) renderStages();
    if (!dom.battle.hidden) {renderBattleLabels();updateGraph();}
  }

  function updateMainProgress(){dom.mainProgress.innerHTML=`<strong>${t("progress",{cleared:clearedCount()})}</strong><span>${t("bestStars",{stars:totalStars()})}</span>`;}
  function setScreen(screen){document.body.dataset.screen=screen;dom.main.hidden=screen!=="main";dom.guide.hidden=screen!=="main";dom.stage.hidden=screen!=="stage";dom.battle.hidden=screen!=="battle";window.scrollTo({top:0,left:0,behavior:"auto"});}

  function showMain(){completing=false;dom.result.hidden=true;setScreen("main");updateMainProgress();requestAnimationFrame(()=>dom.start.focus({preventScroll:true}));}
  function showStage(focusIndex=stageIndex){completing=false;dom.result.hidden=true;setScreen("stage");stageIndex=Math.max(0,Math.min(29,focusIndex));renderStages();requestAnimationFrame(()=>{const card=dom.stageRail.querySelector(`[data-index="${Math.min(save.unlocked-1,stageIndex)}"]`);card?.scrollIntoView({inline:"center",block:"nearest",behavior:"auto"});card?.focus({preventScroll:true});});}

  function stageStatus(stage){if(save.cleared[stage.id-1])return t("cleared");if(stage.id<=save.unlocked)return t("available");return t("locked");}
  function renderStages(){
    dom.stageRail.replaceChildren(...stages.map((stage,index)=>{
      const button=document.createElement("button");
      const locked=stage.id>save.unlocked;
      button.type="button";button.className=`stage-card ${locked?"locked":"unlocked"} ${save.cleared[index]?"cleared":""} ${index===stageIndex?"selected":""}`;button.disabled=locked;button.dataset.index=index;button.dataset.stageId=stage.id;
      button.innerHTML=`<small>${t("stage",{})} ${stage.id} · ${t(stage.ruleKey)}</small><strong>${t(`chapter${stage.chapter}`)}</strong><p>${t(`rule${stage.chapter}`)}</p><footer><span>${stageStatus(stage)}</span><span class="card-stars">${"★".repeat(save.stars[index])}${"☆".repeat(3-save.stars[index])}</span></footer>`;
      return button;
    }));
    dom.stageSummary.textContent=t("stageSummary",{cleared:clearedCount(),stars:totalStars()});
    updateChapterPanel(stageIndex);
  }

  function updateChapterPanel(index){stageIndex=Math.max(0,Math.min(29,index));const stage=stages[stageIndex];dom.chapterKicker.textContent=t("chapter",{number:stage.chapter});dom.chapterTitle.textContent=t(`chapter${stage.chapter}`);dom.chapterRule.textContent=t(`rule${stage.chapter}`);$$('.stage-card.selected').forEach(card=>card.classList.remove("selected"));dom.stageRail.querySelector(`[data-index="${stageIndex}"]`)?.classList.add("selected");}

  function startStage(index){
    stageIndex=index;path=[];hints=0;mistakes=0;restarts=0;hintNode=null;completing=false;startedAt=Date.now();dom.result.hidden=true;setScreen("battle");buildGraph();renderBattleLabels();updateGraph();setFeedback(t("ready"));analytics("game_start",{stage:index+1});requestAnimationFrame(()=>dom.svg.querySelector('[role="button"]')?.focus({preventScroll:true}));window.dispatchEvent(new CustomEvent("weightplay:battle-open"));
  }

  function currentStage(){return stages[stageIndex];}
  function edgeBetween(a,b){return currentStage().edges.find(edge=>edge.key===[a,b].sort((x,y)=>x-y).join("-"));}
  function deriveState(candidatePath=path){
    const stage=currentStage();const used=new Set();let checkpointProgress=0;let keyFound=candidatePath[0]===stage.keyNode;
    for(let i=0;i<candidatePath.length-1;i+=1){const edge=edgeBetween(candidatePath[i],candidatePath[i+1]);if(edge)used.add(edge.key);const node=candidatePath[i+1];const checkpointAt=stage.checkpoints.indexOf(node);if(checkpointAt===checkpointProgress)checkpointProgress+=1;if(node===stage.keyNode)keyFound=true;}
    return {used,checkpointProgress,keyFound,current:candidatePath.at(-1)??null};
  }

  function transitionAllowed(edge,from,state){
    const stage=currentStage();if(state.used.has(edge.key))return {ok:false,reason:"usedTrail"};
    const to=edge.from===from?edge.to:edge.from;
    if(edge.directed&&edge.from!==from)return {ok:false,reason:"wrongWay"};
    if(edge.gate&&!state.keyFound)return {ok:false,reason:"gateLocked"};
    const cpAt=stage.checkpoints.indexOf(to);if(cpAt>state.checkpointProgress)return {ok:false,reason:"checkpoint",number:state.checkpointProgress+1};
    return {ok:true,to,checkpointProgress:cpAt===state.checkpointProgress?state.checkpointProgress+1:state.checkpointProgress,keyFound:state.keyFound||to===stage.keyNode};
  }

  function solveFrom(current,used,checkpointProgress,keyFound){
    const stage=currentStage();if(used.size===stage.edges.length)return [];
    const candidates=stage.edges.filter(edge=>!used.has(edge.key)&&(edge.from===current||edge.to===current));
    for(const edge of candidates){const allowed=transitionAllowed(edge,current,{used,checkpointProgress,keyFound});if(!allowed.ok)continue;const nextUsed=new Set(used);nextUsed.add(edge.key);const rest=solveFrom(allowed.to,nextUsed,allowed.checkpointProgress,allowed.keyFound);if(rest)return [allowed.to,...rest];}
    return null;
  }

  function validStart(node){const stage=currentStage();if(stage.forcedStart!==null&&node!==stage.forcedStart)return false;let cp=stage.checkpoints[0]===node?1:0;return Boolean(solveFrom(node,new Set(),cp,node===stage.keyNode));}
  function setFeedback(message,type=""){dom.feedback.textContent=message;dom.feedbackRow.classList.remove("error","success");if(type)dom.feedbackRow.classList.add(type);}
  function reject(reason,vars={}){mistakes+=1;sound("error");setFeedback(t(reason,vars),"error");dom.scene.classList.remove("shake");void dom.scene.offsetWidth;dom.scene.classList.add("shake");updateAssist();}

  function chooseNode(node){
    if(completing||!dom.result.hidden)return;
    const stage=currentStage();hintNode=null;
    if(path.length===0){if(stage.forcedStart!==null&&node!==stage.forcedStart){reject("wrongStart");return;}if(!validStart(node)){reject("deadEnd");return;}path=[node];sound("click");setFeedback(t("continue"));updateGraph();return;}
    const state=deriveState();const edge=edgeBetween(state.current,node);if(!edge){reject("notConnected");return;}const allowed=transitionAllowed(edge,state.current,state);if(!allowed.ok){reject(allowed.reason,{number:allowed.number});return;}
    const hadKey=state.keyFound;path.push(node);sound("click");updateGraph();const nextState=deriveState();
    if(!hadKey&&nextState.keyFound)setFeedback(t("keyFound"),"success");else if(nextState.checkpointProgress<stage.checkpoints.length)setFeedback(t("checkpoint",{number:nextState.checkpointProgress+1}));else setFeedback(t("continue"));
    if(nextState.used.size===stage.edges.length){completeStage();return;}
    if(!solveFrom(nextState.current,nextState.used,nextState.checkpointProgress,nextState.keyFound))setFeedback(t("deadEnd"),"error");
  }

  function undo(){if(completing||path.length===0)return;path.pop();hintNode=null;sound("click");setFeedback(path.length?t("continue"):t("ready"));updateGraph();}
  function restartAttempt(count=true){if(completing)return;if(count&&path.length)restarts+=1;path=[];hintNode=null;sound("click");setFeedback(t("ready"));updateGraph();if(count)analytics("game_restart",{stage:stageIndex+1});}
  function showHint(){if(completing)return;const stage=currentStage();let node=null;if(path.length===0){node=stage.forcedStart??stage.points.map((_,index)=>index).find(validStart);setFeedback(t("hintStart"));}else{const state=deriveState();node=solveFrom(state.current,state.used,state.checkpointProgress,state.keyFound)?.[0]??null;setFeedback(node===null?t("deadEnd"):t("hintNext"));}if(node!==null){hints+=1;hintNode=node;sound("click");updateGraph();updateAssist();}}

  function buildGraph(){
    const stage=currentStage();const ns="http://www.w3.org/2000/svg";dom.svg.replaceChildren();
    const defs=document.createElementNS(ns,"defs");defs.innerHTML='<marker id="trailArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="arrow-head" d="M 0 0 L 10 5 L 0 10 z"/></marker>';dom.svg.append(defs);
    const edgeLayer=document.createElementNS(ns,"g");edgeLayer.setAttribute("class","edge-layer");stage.edges.forEach(edge=>{const line=document.createElementNS(ns,"line");const [x1,y1]=stage.points[edge.from],[x2,y2]=stage.points[edge.to];line.setAttribute("x1",x1);line.setAttribute("y1",y1);line.setAttribute("x2",x2);line.setAttribute("y2",y2);line.dataset.edge=edge.key;line.classList.add("graph-edge");if(edge.directed){line.classList.add("directed");line.setAttribute("marker-end","url(#trailArrow)");}if(edge.gate)line.classList.add("gate");line.setAttribute("aria-label",t("edgeLabel",{from:edge.from+1,to:edge.to+1}));edgeLayer.append(line);});dom.svg.append(edgeLayer);
    const nodeLayer=document.createElementNS(ns,"g");nodeLayer.setAttribute("class","node-layer");stage.points.forEach(([x,y],index)=>{const group=document.createElementNS(ns,"g");group.classList.add("graph-node");group.dataset.node=index;group.setAttribute("role","button");group.setAttribute("tabindex","0");group.setAttribute("transform",`translate(${x} ${y})`);const halo=document.createElementNS(ns,"circle");halo.setAttribute("r","6.7");halo.classList.add("node-halo");const core=document.createElementNS(ns,"circle");core.setAttribute("r","4.5");core.classList.add("node-core");const label=document.createElementNS(ns,"text");label.classList.add("node-label");label.setAttribute("y",".4");group.append(halo,core,label);group.addEventListener("pointerdown",event=>{event.preventDefault();activePointer=event.pointerId;dom.svg.setPointerCapture?.(event.pointerId);chooseNode(index);});group.addEventListener("keydown",event=>{if(event.repeat)return;if(event.key==="Enter"||event.key===" "){event.preventDefault();chooseNode(index);}});nodeLayer.append(group);});dom.svg.append(nodeLayer);
  }

  function updateGraph(){
    const stage=currentStage();const state=deriveState();$$('.graph-edge').forEach(line=>{line.classList.toggle("used",state.used.has(line.dataset.edge));const edge=stage.edges.find(item=>item.key===line.dataset.edge);line.classList.toggle("open",Boolean(edge?.gate&&state.keyFound));});
    $$('.graph-node').forEach(group=>{const node=Number(group.dataset.node);const cpAt=stage.checkpoints.indexOf(node);group.classList.toggle("current",node===state.current);group.classList.toggle("start",node===stage.forcedStart);group.classList.toggle("key",node===stage.keyNode);group.classList.toggle("checkpoint",cpAt>=0);group.classList.toggle("hinted",node===hintNode);const label=group.querySelector(".node-label");label.textContent=cpAt>=0?String(cpAt+1):node===stage.keyNode?"K":node===stage.forcedStart?"S":"";let aria=t("node",{number:node+1});if(node===stage.forcedStart)aria=t("startNode",{number:node+1});if(node===stage.keyNode)aria=t("keyNode",{number:node+1});if(cpAt>=0)aria=t("checkpointNode",{order:cpAt+1});group.setAttribute("aria-label",aria);group.setAttribute("aria-pressed",String(node===state.current));});
    const used=state.used.size,total=stage.edges.length;dom.edgeProgress.style.width=`${used/total*100}%`;dom.trailCount.textContent=`${used} / ${total}`;dom.starTotal.textContent=String(totalStars());dom.undo.disabled=path.length===0;updateAssist();
  }

  function renderBattleLabels(){const stage=currentStage();dom.stageLabel.textContent=`${t("stage")} ${stage.id} · ${t(`chapter${stage.chapter}`)}`;dom.objective.textContent=t(`rule${stage.chapter}`);}
  function updateAssist(){dom.assist.textContent=t("assist",{hints,mistakes:mistakes+restarts});}

  function completeStage(){
    if(completing)return;completing=true;const stage=currentStage();const elapsed=Date.now()-startedAt;const assists=mistakes+restarts+hints*2;const earned=assists===0?3:assists<=3?2:1;const previous=save.bestTimes[stageIndex];save.cleared[stageIndex]=true;save.stars[stageIndex]=Math.max(save.stars[stageIndex]||0,earned);save.bestTimes[stageIndex]=previous===null?elapsed:Math.min(previous,elapsed);save.unlocked=Math.max(save.unlocked,Math.min(30,stage.id+1));persist();sound("success");setFeedback(t("complete"),"success");dom.scene.classList.add("sparkle");analytics("game_complete",{stage:stage.id,stars:earned,hints,mistakes:mistakes+restarts,time_ms:elapsed});setTimeout(()=>showResult(earned,elapsed,previous),420);
  }

  function showResult(earned,elapsed,previous){const stage=currentStage();dom.resultTitle.textContent=t("resultTitle");dom.resultStars.textContent="★".repeat(earned)+"☆".repeat(3-earned);dom.resultText.textContent=t("resultText",{edges:stage.edges.length,time:formatTime(elapsed)});dom.skillGrid.innerHTML=`<div><small>${t("logic")}</small><strong>${t("logicValue",{edges:stage.edges.length})}</strong></div><div><small>${t("focus")}</small><strong>${t("focusValue",{mistakes:mistakes+restarts})}</strong></div><div><small>${t("problem")}</small><strong>${t("problemValue",{hints})}</strong></div>`;dom.comparison.textContent=previous===null||elapsed<previous?t("newBest"):t("previousBest",{time:formatTime(previous)});dom.next.hidden=stage.id>=30;dom.result.hidden=false;requestAnimationFrame(()=>{(dom.next.hidden?dom.retry:dom.next).focus({preventScroll:true});window.dispatchEvent(new CustomEvent("weightplay:battle-open"));});}

  dom.svg.addEventListener("pointermove",event=>{if(activePointer!==event.pointerId||path.length===0||completing)return;const rect=dom.svg.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width*100;const y=(event.clientY-rect.top)/rect.height*100;let nearest=-1,best=8.5;currentStage().points.forEach(([nx,ny],index)=>{const distance=Math.hypot(nx-x,ny-y);if(distance<best){best=distance;nearest=index;}});if(nearest>=0&&nearest!==path.at(-1))chooseNode(nearest);});
  const endPointer=event=>{if(activePointer===event.pointerId)activePointer=null;};dom.svg.addEventListener("pointerup",endPointer);dom.svg.addEventListener("pointercancel",endPointer);
  dom.stageRail.addEventListener("click",event=>{const card=event.target.closest(".stage-card.unlocked");if(!card)return;startStage(Number(card.dataset.index));});
  dom.stageRail.addEventListener("wonder:stage-snap",event=>{const card=event.detail?.card||document.elementFromPoint(innerWidth/2,Math.min(innerHeight-120,innerHeight*.78))?.closest?.(".stage-card");if(card)updateChapterPanel(Number(card.dataset.index));});
  dom.start.addEventListener("click",()=>{sound("click");showStage();});dom.stageBack.addEventListener("click",()=>{sound("click");showMain();});dom.battleBack.addEventListener("click",()=>{sound("click");showStage(stageIndex);});dom.undo.addEventListener("click",undo);dom.restart.addEventListener("click",()=>restartAttempt(true));dom.hint.addEventListener("click",showHint);dom.retry.addEventListener("click",()=>startStage(stageIndex));dom.resultStages.addEventListener("click",()=>showStage(stageIndex));dom.next.addEventListener("click",()=>startStage(Math.min(29,stageIndex+1)));dom.locale.addEventListener("change",()=>{locale=dom.locale.value;applyLocale();});

  async function boot(){applyLocale();analytics("game_view");const assets=["../../assets/animal-starlight-trails-cover.webp","../../assets/animal-starlight-trails-bg.webp","../../assets/weightplay-character-moon-cap-owl-cutout.webp"];let loaded=0;await Promise.allSettled(assets.map(src=>new Promise(resolve=>{const image=new Image();const done=()=>{loaded+=1;dom.loadingFill.style.width=`${loaded/assets.length*100}%`;resolve();};image.onload=done;image.onerror=done;image.src=src;})));setTimeout(()=>{dom.loading.hidden=true;showMain();},180);}
  if (new URLSearchParams(location.search).get("trial") === "1") {
    window.__animalStarlightTrailsSmoke = {
      stages: stages.map(stage => ({id:stage.id,route:[...stage.route],edges:stage.edges.length,chapter:stage.chapter})),
      startStage,
      snapshot: () => ({stage:stageIndex+1,path:[...path],hints,mistakes,restarts,screen:document.body.dataset.screen,resultVisible:!dom.result.hidden,save:JSON.parse(JSON.stringify(save))}),
    };
  }
  boot();
})();
