(() => {
  "use strict";

  const copy = {
    en:{time:"Time",mistakes:"Mistakes",hints:"Hints",alt:"Completed animal mosaic",row:"row",column:"column",filled:"filled",empty:"empty",forced:"Hint: {line} {number} clue {clue} forces cell {cell} {state}.",none:"Hint: no single row or column is forced yet. Cross-check the intersecting clues."},
    "zh-Hant":{time:"時間",mistakes:"錯誤",hints:"提示",alt:"完成的動物拼圖",row:"橫列",column:"直行",filled:"填色",empty:"留白",forced:"提示：第 {number} {line}的線索 {clue}，可確定第 {cell} 格為{state}。",none:"提示：目前沒有單一橫列或直行能直接確定；請交叉比對相交線索。"},
    "zh-Hans":{time:"时间",mistakes:"错误",hints:"提示",alt:"完成的动物拼图",row:"横行",column:"纵列",filled:"填色",empty:"留白",forced:"提示：第 {number} {line}的线索 {clue}，可确定第 {cell} 格为{state}。",none:"提示：目前没有单一横行或纵列能直接确定；请交叉比对相交线索。"},
    ja:{time:"時間",mistakes:"ミス",hints:"ヒント",alt:"完成した動物モザイク",row:"行",column:"列",filled:"塗る",empty:"空ける",forced:"ヒント：{number}{line}の手掛かり {clue} から、{cell}番目は「{state}」と確定します。",none:"ヒント：今は1つの行や列だけでは確定できません。交差する手掛かりを照合しましょう。"},
    ko:{time:"시간",mistakes:"실수",hints:"힌트",alt:"완성된 동물 모자이크",row:"행",column:"열",filled:"채움",empty:"비움",forced:"힌트: {number}번째 {line}의 단서 {clue}로 {cell}번째 칸은 {state}으로 확정됩니다.",none:"힌트: 지금은 한 행이나 열만으로 확정할 수 없습니다. 교차 단서를 함께 확인하세요."},
    es:{time:"Tiempo",mistakes:"Errores",hints:"Pistas",alt:"Mosaico animal completado",row:"fila",column:"columna",filled:"rellena",empty:"vacía",forced:"Pista: la {line} {number}, con clave {clue}, obliga a que la casilla {cell} esté {state}.",none:"Pista: ninguna fila o columna se resuelve por sí sola todavía. Cruza las pistas."},
    "pt-BR":{time:"Tempo",mistakes:"Erros",hints:"Dicas",alt:"Mosaico de animal concluído",row:"linha",column:"coluna",filled:"preenchida",empty:"vazia",forced:"Dica: a {line} {number}, com pista {clue}, determina que a célula {cell} fica {state}.",none:"Dica: nenhuma linha ou coluna está determinada sozinha. Cruze as pistas."},
    fr:{time:"Temps",mistakes:"Erreurs",hints:"Indices",alt:"Mosaïque animale terminée",row:"ligne",column:"colonne",filled:"remplie",empty:"vide",forced:"Indice : la {line} {number}, avec l’indice {clue}, impose que la case {cell} soit {state}.",none:"Indice : aucune ligne ni colonne n’est encore déterminée seule. Croisez les indices."},
    de:{time:"Zeit",mistakes:"Fehler",hints:"Hinweise",alt:"Fertiges Tiermosaik",row:"Zeile",column:"Spalte",filled:"gefüllt",empty:"leer",forced:"Hinweis: In {line} {number} erzwingt die Vorgabe {clue}, dass Feld {cell} {state} ist.",none:"Hinweis: Noch ist keine einzelne Zeile oder Spalte eindeutig. Gleiche die Kreuzhinweise ab."},
    it:{time:"Tempo",mistakes:"Errori",hints:"Suggerimenti",alt:"Mosaico animale completato",row:"riga",column:"colonna",filled:"piena",empty:"vuota",forced:"Suggerimento: la {line} {number}, con indizio {clue}, impone che la casella {cell} sia {state}.",none:"Suggerimento: nessuna riga o colonna è ancora determinata da sola. Incrocia gli indizi."},
    ru:{time:"Время",mistakes:"Ошибки",hints:"Подсказки",alt:"Готовая мозаика с животным",row:"строка",column:"столбец",filled:"закрашена",empty:"пуста",forced:"Подсказка: {line} {number} с условием {clue} определяет, что клетка {cell} — {state}.",none:"Подсказка: пока ни одна строка или столбец не определяется отдельно. Сопоставьте пересекающиеся условия."},
    hi:{time:"समय",mistakes:"गलतियाँ",hints:"संकेत",alt:"पूरा हुआ पशु मोज़ेक",row:"पंक्ति",column:"स्तंभ",filled:"भरा",empty:"खाली",forced:"संकेत: {line} {number} का सुराग {clue} तय करता है कि खाना {cell} {state} है।",none:"संकेत: अभी कोई एक पंक्ति या स्तंभ अकेले तय नहीं होता। कटते हुए सुरागों को मिलाएँ।"},
    ar:{time:"الوقت",mistakes:"الأخطاء",hints:"التلميحات",alt:"فسيفساء الحيوان المكتملة",row:"الصف",column:"العمود",filled:"ممتلئة",empty:"فارغة",forced:"تلميح: دليل {line} {number} وهو {clue} يثبت أن الخانة {cell} {state}.",none:"تلميح: لا يوجد صف أو عمود محسوم بمفرده الآن. طابق الأدلة المتقاطعة."}
  };
  const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||"en",t=copy[locale]||copy.en;
  const result=document.querySelector("#resultModal"),feedback=document.querySelector("#feedback"),records=new WeakMap();
  let active=null,last=performance.now();
  const state=()=>window.__blockTrilogyTest?.getState?.();
  const recordFor=engine=>{let record=records.get(engine);if(!record){record={elapsed:0,hints:0,index:0,signature:""};records.set(engine,record)}return record};
  const runs=line=>{const values=[];let count=0;line.forEach((filled,index)=>{if(filled)count++;if((!filled||index===line.length-1)&&count){values.push(count);count=0}});return values.length?values:[0]};
  function candidates(length,clues,cells){
    if(clues.length===1&&clues[0]===0)return cells.some(value=>value===1)?[]:[Array(length).fill(false)];
    const output=[];
    const place=(clueIndex,start,line)=>{const remaining=clues.slice(clueIndex+1).reduce((sum,value)=>sum+value,0)+Math.max(0,clues.length-clueIndex-1),max=length-clues[clueIndex]-remaining;for(let at=start;at<=max;at++){const nextLine=[...line];for(let index=at;index<at+clues[clueIndex];index++)nextLine[index]=true;const next=at+clues[clueIndex]+1;if(clueIndex<clues.length-1)place(clueIndex+1,next,nextLine);else if(cells.every((value,index)=>value===0||(value===1)===nextLine[index]))output.push(nextLine)}};
    place(0,0,Array(length).fill(false));return output;
  }
  function deductions(engine){
    const output=[];
    for(const axis of ["row","column"])for(let number=0;number<engine.size;number++){
      const solved=axis==="row"?engine.solution[number]:engine.solution.map(row=>row[number]),cells=axis==="row"?engine.cells[number]:engine.cells.map(row=>row[number]),clue=runs(solved),options=candidates(engine.size,clue,cells);
      if(!options.length)continue;
      for(let cell=0;cell<engine.size;cell++)if(cells[cell]===0&&options.every(option=>option[cell]===options[0][cell]))output.push({axis,number,cell,clue,state:options[0][cell]});
    }
    return output;
  }
  const format=(template,values)=>Object.entries(values).reduce((value,[key,replacement])=>value.replaceAll(`{${key}}`,replacement),template);
  function offerHint(){
    const current=state(),engine=current?.engine;if(current?.screen!=="battle"||engine?.kind!=="mosaic")return;
    const record=recordFor(engine),choices=deductions(engine),signature=engine.cells.flat().join("");if(signature!==record.signature){record.signature=signature;record.index=0}record.hints++;
    if(!choices.length){feedback.textContent=t.none;return}
    const choice=choices[record.index++%choices.length];engine.cursor=choice.axis==="row"?{x:choice.cell,y:choice.number}:{x:choice.number,y:choice.cell};
    keyboardActive=true;
    syncKeyboardCursor(engine);
    feedback.textContent=format(t.forced,{line:t[choice.axis],number:String(choice.number+1),clue:choice.clue.join(" "),cell:String(choice.cell+1),state:choice.state?t.filled:t.empty});
  }
  function resultImage(engine){
    const canvas=document.createElement("canvas"),size=256,cell=size/engine.size,palette=["#b894ff","#69d9ff","#ffd96b","#ff7bbf"];canvas.width=size;canvas.height=size;const context=canvas.getContext("2d");context.fillStyle="#071326";context.fillRect(0,0,size,size);
    for(let y=0;y<engine.size;y++)for(let x=0;x<engine.size;x++){context.fillStyle=engine.solution[y][x]?palette[(x+y)%palette.length]:"#102e45";context.fillRect(x*cell+1,y*cell+1,cell-2,cell-2)}return canvas.toDataURL("image/png");
  }
  function updateResult(){
    if(result.hidden)return;const current=state(),engine=current?.engine;if(engine?.kind!=="mosaic"||!engine.cells.every((row,y)=>row.every((value,x)=>(value===1)===engine.solution[y][x])))return;
    const record=recordFor(engine),image=result.querySelector(".result-art"),labels=result.querySelectorAll(".result-stats b");image.src=resultImage(engine);image.alt=t.alt;image.dataset.completedMosaic="true";[t.time,t.mistakes,t.hints].forEach((value,index)=>labels[index].textContent=value);document.querySelector("#resultA").textContent=`${Math.floor(record.elapsed/60)}:${String(Math.floor(record.elapsed%60)).padStart(2,"0")}`;document.querySelector("#resultB").textContent=String(engine.mistakes);document.querySelector("#resultC").textContent=String(record.hints);
  }
  const canvas=document.querySelector("#arena"),arenaWrap=document.querySelector("#arenaWrap"),keyboardCursor=document.createElement("div");
  let keyboardEngine=null,keyboardActive=false;
  const boardLabel=canvas.getAttribute("aria-label")||"";
  keyboardCursor.id="mosaicKeyboardCursor";
  keyboardCursor.setAttribute("aria-hidden","true");
  keyboardCursor.style.cssText="position:absolute;z-index:4;pointer-events:none;border:3px solid #fff176;border-radius:7px;box-shadow:0 0 0 2px #071326,0 0 18px #63f6d3;display:none";
  arenaWrap.append(keyboardCursor);
  function cursorLabel(engine){
    return `${boardLabel} · ${t.row} ${engine.cursor.y+1}, ${t.column} ${engine.cursor.x+1}`;
  }
  function syncKeyboardCursor(engine,announceMove=false){
    const geometry=window.__blockTrilogyTest?.geometry?.(),canvasRect=canvas.getBoundingClientRect(),wrapRect=arenaWrap.getBoundingClientRect();
    if(!keyboardActive||!geometry||!canvasRect.width){keyboardCursor.style.display="none";return}
    const scaleX=canvasRect.width/wrapRect.width,scaleY=canvasRect.height/wrapRect.height;
    const cell=Math.min(geometry.cell*scaleX,geometry.cell*scaleY),left=canvasRect.left-wrapRect.left+geometry.ox*scaleX+engine.cursor.x*cell,top=canvasRect.top-wrapRect.top+geometry.oy*scaleY+engine.cursor.y*cell;
    Object.assign(keyboardCursor.style,{display:"block",left:`${left+2}px`,top:`${top+2}px`,width:`${Math.max(0,cell-4)}px`,height:`${Math.max(0,cell-4)}px`});
    const label=cursorLabel(engine);canvas.setAttribute("aria-label",label);if(announceMove)feedback.textContent=label;
  }
  document.addEventListener("keydown",event=>{
    const current=state(),engine=current?.engine;if(current?.screen!=="battle"||engine?.kind!=="mosaic"||document.activeElement!==canvas)return;
    const moves={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]},move=moves[event.key];
    if(move){
      event.preventDefault();keyboardActive=true;
      engine.cursor.x=Math.max(0,Math.min(engine.size-1,engine.cursor.x+move[0]));
      engine.cursor.y=Math.max(0,Math.min(engine.size-1,engine.cursor.y+move[1]));
      syncKeyboardCursor(engine,true);return;
    }
    if(event.key!=="Enter"&&event.key!==" ")return;
    event.preventDefault();if(event.repeat)return;keyboardActive=true;
    const geometry=window.__blockTrilogyTest.geometry(),rect=canvas.getBoundingClientRect(),wrapRect=arenaWrap.getBoundingClientRect(),before=feedback.textContent;
    const scaleX=rect.width/wrapRect.width,scaleY=rect.height/wrapRect.height;
    canvas.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true,clientX:rect.left+(geometry.ox+(engine.cursor.x+.5)*geometry.cell)*scaleX,clientY:rect.top+(geometry.oy+(engine.cursor.y+.5)*geometry.cell)*scaleY,pointerId:1,pointerType:"mouse"}));
    keyboardActive=true;
    if(feedback.textContent===before){const mode=document.querySelector(engine.mode===1?"#paintMode":"#markMode")?.textContent.trim()||"";feedback.textContent=`${mode} · ${t.row} ${engine.cursor.y+1}, ${t.column} ${engine.cursor.x+1}`}
    syncKeyboardCursor(engine);
  },true);
  canvas.addEventListener("pointerdown",()=>{keyboardActive=false;keyboardCursor.style.display="none"});
  document.addEventListener("click",event=>{if(event.target.closest?.("#mosaicHint")){event.preventDefault();event.stopImmediatePropagation();offerHint()}},true);
  new MutationObserver(updateResult).observe(result,{attributes:true,attributeFilter:["hidden"]});
  const tick=now=>{const current=state(),engine=current?.engine;if(engine?.kind==="mosaic"&&engine!==active){active=engine;recordFor(engine);last=now}if(engine?.kind==="mosaic"&&engine!==keyboardEngine){keyboardEngine=engine;keyboardActive=false;canvas.setAttribute("aria-label",boardLabel);canvas.tabIndex=0;canvas.setAttribute("aria-keyshortcuts","ArrowUp ArrowDown ArrowLeft ArrowRight Enter Space");canvas.setAttribute("aria-describedby","feedback")}if(engine===active&&current?.screen==="battle"&&result.hidden&&document.querySelector("#helpModal")?.hidden&&document.querySelector("#leaveModal")?.hidden&&!document.hidden)recordFor(engine).elapsed+=(now-last)/1000;if(current?.screen==="battle"&&engine===keyboardEngine)syncKeyboardCursor(engine);else keyboardCursor.style.display="none";last=now;requestAnimationFrame(tick)};requestAnimationFrame(tick);
})();
