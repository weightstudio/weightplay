(() => {
  "use strict";

  const SAVE_KEY = "weightplay_animal_one_line_v1";
  const TUTORIAL_KEY = "weightplay_tutorial_seen_animal_one_line_v1";
  const $ = (selector) => document.querySelector(selector);
  const localeSegment = location.pathname.split("/").filter(Boolean)[0] || "en";
  const routeLocale = ({ en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", es: "es", ja: "ja" })[localeSegment] || "en";

  const EN = {
    title: "One Line", language: "Language", eyebrow: "Mimi's color-grid workshop",
    pitch: "Plan one continuous route and fill every open cell without visiting any cell twice.",
    start: "Start Game", chooseStage: "Choose Puzzle", attempts: "Attempts", seals: "Cells",
    restart: "Restart", hint: "Show Hint", retry: "Retry", stages: "Stages", next: "Next Stage",
    skillReport: "Puzzle Report", tutorialTitle: "Fill every cell with one line.",
    tutorial1: "Start on the glowing paw, then tap or drag through neighboring cells.", tutorial2: "You may release at any time; your route stays on the board.",
    tutorial3: "Move back over the previous cell to undo. Fill every open cell without crossing your route.", tutorialStart: "Start Playing",
    progress: "{cleared} / 30 puzzles cleared", bestStars: "{stars} stars collected", stage: "Stage",
    ready: "Start at the glowing paw, then fill every open cell.", drawing: "Keep going—each cell may be used only once.",
    incomplete: "Some cells are still empty. Keep planning your route.", revisit: "That cell is already in the route.",
    deadEnd: "No route remains, but cells are still empty.", complete: "Every cell filled!",
    hintText: "The next cell in one possible route is glowing.", summary: "{cleared} cleared · {stars} stars",
    locked: "Locked", available: "Ready", cleared: "Cleared", resultTitle: "Puzzle Complete",
    resultText: "You filled all {cells} cells in {time} with {attempts} attempt(s).", newBest: "New best time!", best: "Best time: {time}",
    route: "Route", planning: "Planning", control: "Control", routeValue: "{cells} cells", planningValue: "{attempts} attempt(s)", controlValue: "No repeats",
    chapter1: "First Steps", chapter2: "Corner Planning", chapter3: "Stone Blocks", chapter4: "Long Routes", chapter5: "Tight Choices", chapter6: "Master Grids",
    rule1: "Learn orthogonal movement and fill every open cell.", rule2: "Plan around corners before committing your route.",
    rule3: "Stone cells split the board into harder choices.", rule4: "Longer boards punish early wrong turns.",
    rule5: "Several openings look useful, but only complete routes win.", rule6: "Combine blocks, narrow exits, and long one-line routes."
  };
  const STRINGS = {
    en: EN,
    "zh-Hant": { ...EN, title: "One Line 一筆到底", language: "語言", eyebrow: "彩虹跳跳米米的彩格工坊", pitch: "先想好路線，再用一筆填滿所有空格；每一格只能走一次。", start: "開始遊戲", chooseStage: "選擇關卡", attempts: "嘗試", seals: "格子", restart: "重新開始", hint: "顯示提示", retry: "再試一次", stages: "關卡", next: "下一關", skillReport: "解謎報告", tutorialTitle: "用一筆填滿所有格子。", tutorial1: "從發光腳印開始，可以逐格點擊或連續拖曳。", tutorial2: "隨時都能放手，已完成的路線會保留。", tutorial3: "滑回上一格可以撤銷，最後要填滿所有空格。", tutorialStart: "開始挑戰", progress: "已完成 {cleared} / 30 關", bestStars: "已收集 {stars} 顆星", stage: "關卡", ready: "從發光腳印開始，可以逐格點擊或拖曳。", drawing: "可以放手思考；滑回上一格可撤銷。", incomplete: "還有格子沒填滿，繼續規劃路線。", revisit: "這一格已經在路線中。", deadEnd: "路線走不下去了，但還有空格未填滿。", complete: "所有格子都填滿了！", hintText: "其中一種解法的下一格正在發光。", summary: "完成 {cleared} 關 · {stars} 顆星", locked: "未解鎖", available: "可挑戰", cleared: "已完成", resultTitle: "一筆完成", resultText: "你用 {time}、{attempts} 次嘗試填滿 {cells} 格。", newBest: "新的最佳時間！", best: "最佳時間：{time}", route: "路線", planning: "規劃", control: "規則", routeValue: "{cells} 格", planningValue: "{attempts} 次嘗試", controlValue: "沒有重複", chapter1: "起步練習", chapter2: "轉角規劃", chapter3: "石塊障礙", chapter4: "長線挑戰", chapter5: "困難抉擇", chapter6: "大師棋盤", rule1: "練習上下左右移動，填滿每個空格。", rule2: "落筆前先規劃轉角，避免太早封死路線。", rule3: "石塊會切開棋盤，必須選擇正確方向。", rule4: "路線更長，前段的錯誤會影響最後幾格。", rule5: "多個方向看似可行，只有完整填滿才算成功。", rule6: "綜合石塊、窄出口與長距離一筆路線。" },
    "zh-Hans": { ...EN, title: "One Line 一笔到底", language: "语言", eyebrow: "彩虹跳跳米米的彩格工坊", pitch: "先想好路线，再用一笔填满所有空格；每一格只能走一次。", start: "开始游戏", chooseStage: "选择关卡", attempts: "尝试", seals: "格子", restart: "重新开始", hint: "显示提示", retry: "再试一次", stages: "关卡", next: "下一关", skillReport: "解谜报告", tutorialTitle: "用一笔填满所有格子。", tutorial1: "从发光的脚印起点开始。", tutorial2: "拖曳到上下左右相邻格，不能斜走。", tutorial3: "走过的格子不能重复，所有空格都要上色。", tutorialStart: "开始挑战", ready: "从发光脚印开始，一笔填满所有空格。", drawing: "继续前进，每一格只能使用一次。", incomplete: "还有格子没填满，换一条路线试试看。", revisit: "这一格已经走过了，请换一条路线。", deadEnd: "路线走不下去了，但还有空格未填满。", complete: "所有格子都填满了！", hintText: "其中一种解法的下一格正在发光。", summary: "完成 {cleared} 关 · {stars} 颗星", locked: "未解锁", available: "可挑战", cleared: "已完成", resultTitle: "一笔完成", resultText: "你用 {time}、{attempts} 次尝试填满 {cells} 格。", newBest: "新的最佳时间！", best: "最佳时间：{time}", route: "路线", planning: "规划", control: "规则", routeValue: "{cells} 格", planningValue: "{attempts} 次尝试", controlValue: "没有重复" },
    es: { ...EN, eyebrow: "El taller de cuadrículas de Mimi", pitch: "Planea una sola ruta y colorea todas las casillas sin repetir ninguna.", start: "Comenzar juego", chooseStage: "Elegir nivel", attempts: "Intentos", seals: "Casillas", restart: "Reiniciar", hint: "Mostrar pista", retry: "Reintentar", stages: "Niveles", next: "Siguiente nivel", tutorialTitle: "Llena todas las casillas con una línea.", tutorial1: "Empieza en la huella brillante.", tutorial2: "Puedes soltar cuando quieras; la ruta permanece en el tablero.", tutorial3: "Vuelve a la casilla anterior para deshacer y llena todas las casillas abiertas.", tutorialStart: "Empezar", ready: "Empieza en la huella; puedes tocar o arrastrar.", drawing: "Puedes soltar para pensar y volver atrás para deshacer.", incomplete: "Aún quedan casillas vacías. Continúa planificando.", revisit: "Esa casilla ya forma parte de la ruta.", deadEnd: "La ruta terminó, pero quedan casillas vacías.", complete: "¡Todas las casillas completas!", hintText: "Brilla la siguiente casilla de una posible solución.", resultTitle: "Nivel completado" },
    ja: { ...EN, eyebrow: "ミミのカラーグリッド工房", pitch: "ルートを考え、同じマスを通らずに全ての空きマスを一筆で塗ろう。", start: "ゲーム開始", chooseStage: "ステージ選択", attempts: "挑戦", seals: "マス", restart: "やり直す", hint: "ヒント", retry: "もう一度", stages: "ステージ", next: "次のステージ", tutorialTitle: "一筆で全てのマスを塗ろう。", tutorial1: "光る足あとマスから始めます。", tutorial2: "上下左右の隣のマスへドラッグします。斜め移動はできません。", tutorial3: "同じマスは通れません。空きマスを全て塗れば成功です。", tutorialStart: "スタート", ready: "光る足あとから始め、全てのマスを塗ろう。", drawing: "続けよう。同じマスは一度しか使えません。", incomplete: "まだ空きマスがあります。別のルートを考えよう。", revisit: "そのマスは通過済みです。", deadEnd: "進めませんが、まだ空きマスがあります。", complete: "全てのマスを塗りました！", hintText: "解き方の一例となる次のマスが光っています。", resultTitle: "パズル完成" }
  };
  Object.assign(STRINGS["zh-Hans"], {
    tutorial1: "从发光脚印开始，可以逐格点击或连续拖动。",
    tutorial2: "随时都能松手，已经完成的路线会保留。",
    tutorial3: "滑回上一格可以撤销，最后要填满所有空格。",
    ready: "从发光脚印开始，可以逐格点击或拖动。",
    drawing: "可以松手思考；滑回上一格可撤销。",
    incomplete: "还有格子没填满，继续规划路线。",
    revisit: "这一格已经在路线中。"
  });
  Object.assign(STRINGS.ja, {
    tutorial1: "光る足あとから始め、1マスずつタップまたは連続ドラッグできます。",
    tutorial2: "いつでも指を離せます。進めたルートは盤面に残ります。",
    tutorial3: "1つ前のマスへ戻ると取り消せます。最後に全ての空きマスを塗ります。",
    ready: "光る足あとから、タップまたはドラッグで始めよう。",
    drawing: "指を離して考えられます。1つ前へ戻ると取り消せます。",
    incomplete: "まだ空きマスがあります。ルートを続けて考えよう。",
    revisit: "そのマスはすでにルートに含まれています。"
  });
  const S = STRINGS[routeLocale] || EN;
  const text = (key, vars = {}) => String(S[key] ?? EN[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");

  function rowSnake(rows, cols) { const p=[]; for(let r=0;r<rows;r++){ const cs=[...Array(cols).keys()]; if(r%2) cs.reverse(); cs.forEach(c=>p.push([r,c])); } return p; }
  function colSnake(rows, cols) { const p=[]; for(let c=0;c<cols;c++){ const rs=[...Array(rows).keys()]; if(c%2) rs.reverse(); rs.forEach(r=>p.push([r,c])); } return p; }
  function spiral(rows, cols) { const p=[]; let top=0,left=0,bottom=rows-1,right=cols-1; while(top<=bottom&&left<=right){ for(let c=left;c<=right;c++)p.push([top,c]); top++; for(let r=top;r<=bottom;r++)p.push([r,right]); right--; if(top<=bottom){for(let c=right;c>=left;c--)p.push([bottom,c]); bottom--;} if(left<=right){for(let r=bottom;r>=top;r--)p.push([r,left]); left++;} } return p; }
  const configs = [
    [3,3,"row",0,0,0],[3,4,"col",1,0,0],[4,4,"row",0,1,1],[4,4,"spiral",1,1,0],[4,4,"col",0,2,1],
    [4,5,"row",2,0,0],[4,5,"spiral",0,2,1],[5,4,"col",1,2,0],[4,5,"row",0,3,1],[5,4,"spiral",2,1,0],
    [5,5,"row",2,2,0],[5,5,"col",1,3,1],[5,5,"spiral",0,4,0],[5,5,"row",3,1,1],[5,5,"spiral",2,3,1],
    [5,6,"col",2,2,0],[6,5,"row",1,4,1],[5,6,"spiral",3,2,0],[6,5,"col",4,1,1],[5,6,"row",2,4,0],
    [6,6,"spiral",2,3,0],[6,6,"row",4,2,1],[6,6,"col",3,4,0],[6,6,"spiral",5,1,1],[6,6,"row",2,6,0],
    [6,6,"col",5,2,1],[6,6,"spiral",1,7,0],[6,6,"row",6,1,1],[6,6,"col",2,7,0],[6,6,"spiral",4,4,1]
  ];
  const generators={row:rowSnake,col:colSnake,spiral};
  const levels=configs.map(([rows,cols,kind,trimStart,trimEnd,reverse],index)=>{ let solution=generators[kind](rows,cols).slice(trimStart,rows*cols-trimEnd); if(reverse) solution.reverse(); return {index,rows,cols,solution,open:new Set(solution.map(([r,c])=>`${r},${c}`))}; });
  levels.forEach((level)=>{ const seen=new Set(); level.solution.forEach(([r,c],i)=>{const k=`${r},${c}`;if(seen.has(k)||r<0||c<0||r>=level.rows||c>=level.cols)throw Error(`Invalid level ${level.index+1}`);seen.add(k);if(i){const [pr,pc]=level.solution[i-1];if(Math.abs(pr-r)+Math.abs(pc-c)!==1)throw Error(`Broken level ${level.index+1}`);}}); });

  const defaultSave={unlocked:1,cleared:{},stars:{},best:{}};
  let save; try { save={...defaultSave,...JSON.parse(localStorage.getItem(SAVE_KEY)||"{}")}; } catch { save={...defaultSave}; }
  let stageIndex=0,attempts=1,visited=[],visitedSet=new Set(),drawing=false,failed=false,startTime=0,lastPoint=null,hintUsed=false;
  const dom={loading:$("#loadingPanel"),main:$("#mainScreen"),guide:$(".game-page-info"),stage:$("#stageScreen"),battle:$("#battleScreen"),locale:$("#localeSelect"),mainProgress:$("#mainProgress"),start:$("#startBtn"),stageBack:$("#stageBackBtn"),rail:$("#stageRail"),stageSummary:$("#stageSummary"),lessonKicker:$("#lessonKicker"),lessonTitle:$("#lessonTitle"),lessonRule:$("#lessonRule"),battleBack:$("#battleBackBtn"),stageLabel:$("#stageLabel"),progressFill:$("#progressFill"),attemptCount:$("#attemptCount"),sealCount:$("#sealCount"),objective:$("#objectiveRow"),board:$("#traceBoard"),feedback:$("#feedbackText"),assist:$("#assistText"),restart:$("#restartBtn"),hint:$("#hintBtn"),result:$("#resultPanel"),resultTitle:$("#resultTitle"),resultStars:$("#resultStars"),resultText:$("#resultText"),skillGrid:$("#skillGrid"),bestText:$("#bestText"),retry:$("#retryBtn"),resultStages:$("#resultStagesBtn"),next:$("#nextBtn"),tutorial:$("#tutorial"),tutorialClose:$("#tutorialClose"),tutorialStart:$("#tutorialStart")};

  function persist(){localStorage.setItem(SAVE_KEY,JSON.stringify(save));}
  function chapter(i){return Math.min(5,Math.floor(i/5));}
  function applyLocale(){ document.documentElement.lang=routeLocale; document.querySelectorAll("[data-one-line-i18n]").forEach(el=>el.textContent=text(el.dataset.oneLineI18n)); if(dom.locale)dom.locale.value=routeLocale; }
  function setScreen(name){document.body.dataset.screen=name;dom.main.hidden=name!=="main";dom.guide.hidden=name!=="main";dom.stage.hidden=name!=="stage";dom.battle.hidden=name!=="battle";}
  function showMain(){setScreen("main");const cleared=Object.keys(save.cleared||{}).length,stars=Object.values(save.stars||{}).reduce((a,b)=>a+Number(b||0),0);dom.mainProgress.textContent=`${text("progress",{cleared})} · ${text("bestStars",{stars})}`;}
  function renderStages(){dom.rail.innerHTML=levels.map((level,i)=>{const unlocked=i<(save.unlocked||1),cleared=save.cleared?.[i];return `<button class="stage-card ${unlocked?"unlocked":"locked"} ${i===stageIndex?"selected":""}" type="button" data-index="${i}" ${unlocked?"":"disabled"}><small>${text("stage")} ${i+1}</small><strong>${level.rows} × ${level.cols}</strong><span>${cleared?text("cleared"):unlocked?text("available"):text("locked")}</span></button>`;}).join("");}
  function updateLesson(i){stageIndex=i;const ch=chapter(i);dom.lessonKicker.textContent=`${text("stage")} ${i+1} / 30`;dom.lessonTitle.textContent=text(`chapter${ch+1}`);dom.lessonRule.textContent=text(`rule${ch+1}`);dom.rail.querySelectorAll(".stage-card").forEach((c,n)=>c.classList.toggle("selected",n===i));}
  function showStage(focus=stageIndex){setScreen("stage");renderStages();updateLesson(Math.min(focus,(save.unlocked||1)-1));dom.stageSummary.textContent=text("summary",{cleared:Object.keys(save.cleared||{}).length,stars:Object.values(save.stars||{}).reduce((a,b)=>a+Number(b||0),0)});requestAnimationFrame(()=>dom.rail.querySelector(`[data-index="${stageIndex}"]`)?.scrollIntoView({behavior:"instant",inline:"center",block:"nearest"}));}
  function renderBoard(){const level=levels[stageIndex];dom.board.innerHTML=`<div id="lineGrid" class="line-grid" role="grid" style="--rows:${level.rows};--cols:${level.cols}">${[...Array(level.rows)].flatMap((_,r)=>[...Array(level.cols)].map((__,c)=>{const open=level.open.has(`${r},${c}`),start=open&&level.solution[0][0]===r&&level.solution[0][1]===c;return `<div class="line-cell ${open?"is-open":"is-blocked"} ${start?"is-start":""}" role="gridcell" data-row="${r}" data-col="${c}">${start?'<span aria-hidden="true">🐾</span>':""}</div>`;})).join("")}</div>`;}
  function resetAttempt(resetCount=false){if(resetCount)attempts=1;visited=[];visitedSet.clear();drawing=false;failed=false;lastPoint=null;hintUsed=false;renderBoard();updateHud();dom.feedback.textContent=text("ready");dom.assist.textContent="";dom.result.hidden=true;}
  function updateHud(){const total=levels[stageIndex].solution.length;dom.attemptCount.textContent=attempts;dom.sealCount.textContent=`${visited.length} / ${total}`;dom.progressFill.style.width=`${visited.length/total*100}%`;}
  function startStage(index){stageIndex=Math.max(0,Math.min(29,index));attempts=1;setScreen("battle");dom.stageLabel.textContent=`${text("stage")} ${stageIndex+1}`;dom.objective.textContent=text("ready");resetAttempt(false);startTime=performance.now();}
  function cellAt(x,y){const el=document.elementFromPoint(x,y)?.closest?.(".line-cell.is-open");return el&&dom.board.contains(el)?el:null;}
  function keyOf(el){return `${el.dataset.row},${el.dataset.col}`;}
  function visit(el){if(!el||failed)return false;const key=keyOf(el);const [r,c]=key.split(",").map(Number);if(!visited.length){const [sr,sc]=levels[stageIndex].solution[0];if(r!==sr||c!==sc)return false;}else{const [pr,pc]=visited[visited.length-1];if(pr===r&&pc===c)return true;if(Math.abs(pr-r)+Math.abs(pc-c)!==1)return false;const previous=visited[visited.length-2];if(previous&&previous[0]===r&&previous[1]===c){const [removedR,removedC]=visited.pop();visitedSet.delete(`${removedR},${removedC}`);dom.board.querySelector(`[data-row="${removedR}"][data-col="${removedC}"]`)?.classList.remove("is-visited","is-current");el.classList.add("is-current");dom.feedback.textContent=text("drawing");updateHud();return true;}if(visitedSet.has(key)){dom.feedback.textContent=text("revisit");return false;}}visited.push([r,c]);visitedSet.add(key);el.classList.add("is-visited","is-current");dom.board.querySelectorAll(".line-cell.is-current").forEach(n=>{if(n!==el)n.classList.remove("is-current");});dom.feedback.textContent=text("drawing");updateHud();if(visited.length===levels[stageIndex].solution.length){win();return true;}return true;}
  function sampleTo(x,y){if(!lastPoint){lastPoint={x,y};visit(cellAt(x,y));return;}const dist=Math.hypot(x-lastPoint.x,y-lastPoint.y),steps=Math.max(1,Math.ceil(dist/8));for(let i=1;i<=steps&&!failed;i++){const px=lastPoint.x+(x-lastPoint.x)*i/steps,py=lastPoint.y+(y-lastPoint.y)*i/steps;visit(cellAt(px,py));}lastPoint={x,y};}
  function fail(reason){if(failed)return;failed=true;drawing=false;dom.feedback.textContent=text(reason);attempts++;setTimeout(()=>{if(document.body.dataset.screen==="battle"&&!dom.result.hidden)return;if(document.body.dataset.screen==="battle")resetAttempt(false);},650);}
  function win(){drawing=false;failed=false;const elapsed=Math.max(.1,(performance.now()-startTime)/1000),previous=Number(save.best?.[stageIndex]||0),isBest=!previous||elapsed<previous;save.cleared[stageIndex]=true;save.stars[stageIndex]=hintUsed?2:3;save.best[stageIndex]=isBest?elapsed:previous;save.unlocked=Math.max(save.unlocked||1,Math.min(30,stageIndex+2));persist();dom.feedback.textContent=text("complete");dom.resultTitle.textContent=text("resultTitle");dom.resultStars.textContent="★".repeat(hintUsed?2:3)+"☆".repeat(hintUsed?1:0);dom.resultText.textContent=text("resultText",{cells:levels[stageIndex].solution.length,time:`${elapsed.toFixed(1)}s`,attempts});dom.skillGrid.innerHTML=`<div><small>${text("route")}</small><strong>${text("routeValue",{cells:visited.length})}</strong></div><div><small>${text("planning")}</small><strong>${text("planningValue",{attempts})}</strong></div><div><small>${text("control")}</small><strong>${text("controlValue")}</strong></div>`;dom.bestText.textContent=isBest?text("newBest"):text("best",{time:`${previous.toFixed(1)}s`});dom.next.hidden=stageIndex===29;setTimeout(()=>dom.result.hidden=false,250);}

  dom.board.addEventListener("pointerdown",e=>{if(failed||!dom.result.hidden)return;const cell=cellAt(e.clientX,e.clientY),start=levels[stageIndex].solution[0];if(!cell)return;const r=Number(cell.dataset.row),c=Number(cell.dataset.col);if(!visited.length&&(r!==start[0]||c!==start[1]))return;if(visited.length){const [pr,pc]=visited[visited.length-1];if(Math.abs(pr-r)+Math.abs(pc-c)>1)return;}e.preventDefault();drawing=true;if(!startTime)startTime=performance.now();dom.board.setPointerCapture?.(e.pointerId);lastPoint={x:e.clientX,y:e.clientY};visit(cell);});
  dom.board.addEventListener("pointermove",e=>{if(!drawing||failed)return;e.preventDefault();sampleTo(e.clientX,e.clientY);});
  const finish=e=>{if(!drawing)return;sampleTo(e.clientX,e.clientY);drawing=false;dom.board.releasePointerCapture?.(e.pointerId);if(visited.length<levels[stageIndex].solution.length)dom.feedback.textContent=text("incomplete");};
  dom.board.addEventListener("pointerup",finish);dom.board.addEventListener("pointercancel",()=>{drawing=false;});
  dom.start.addEventListener("click",()=>{showStage();if(!localStorage.getItem(TUTORIAL_KEY))dom.tutorial.hidden=false;});
  dom.stageBack.addEventListener("click",showMain);dom.battleBack.addEventListener("click",()=>showStage(stageIndex));
  dom.rail.addEventListener("click",e=>{const card=e.target.closest(".stage-card.unlocked");if(card)startStage(Number(card.dataset.index));});
  dom.rail.addEventListener("wonder:stage-snap",e=>{const card=e.detail?.card;if(card)updateLesson(Number(card.dataset.index));});
  dom.restart.addEventListener("click",()=>resetAttempt(true));
  dom.hint.addEventListener("click",()=>{hintUsed=true;const next=levels[stageIndex].solution.find(([r,c])=>!visitedSet.has(`${r},${c}`));if(next){const cell=dom.board.querySelector(`[data-row="${next[0]}"][data-col="${next[1]}"]`);cell?.classList.add("is-hint");setTimeout(()=>cell?.classList.remove("is-hint"),1300);}dom.feedback.textContent=text("hintText");});
  dom.retry.addEventListener("click",()=>startStage(stageIndex));dom.resultStages.addEventListener("click",()=>showStage(stageIndex));dom.next.addEventListener("click",()=>startStage(Math.min(29,stageIndex+1)));
  dom.locale?.addEventListener("change",()=>{const segment=({en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",es:"es",ja:"ja"})[dom.locale.value];if(segment&&segment!==localeSegment)location.href=`/${segment}/games/animal-one-line/${location.search}${location.hash}`;});
  function closeTutorial(){localStorage.setItem(TUTORIAL_KEY,"1");dom.tutorial.hidden=true;}dom.tutorialClose.addEventListener("click",closeTutorial);dom.tutorialStart.addEventListener("click",()=>{closeTutorial();startStage(0);});
  window.__animalOneLineSmoke={levels:levels.map(l=>({rows:l.rows,cols:l.cols,solution:l.solution})),startStage,snapshot:()=>({stage:stageIndex+1,visited:visited.length,total:levels[stageIndex].solution.length,screen:document.body.dataset.screen,result:!dom.result.hidden,feedback:dom.feedback.textContent})};
  applyLocale();setTimeout(()=>{dom.loading.hidden=true;showMain();},180);
})();
