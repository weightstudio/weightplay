(()=>{
  "use strict";
  const codes=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"],levels=window.TANGRAM_LEVELS.levels,pieceDefs=window.TANGRAM_LEVELS.pieces,parts=pieceDefs.map(piece=>piece.id);
  const $=s=>document.querySelector(s),screens=[...document.querySelectorAll(".screen")],key="wp-animal-tangram-v1";
  document.body.setAttribute("data-runtime-localize","off");
  const artStyle=document.createElement("style");
  artStyle.textContent=`
    .canvas{background:linear-gradient(155deg,#fbfff4e8,#d5ecd8e8),url("../../assets/animal-tangram-cover-kids-v2.webp") center/cover}
    .result-mark{width:132px;height:96px;border-radius:22px;margin:0 auto 12px;background:url("../../assets/animal-tangram-cover-kids-v2.webp") 50% 24%/cover no-repeat;color:transparent;box-shadow:0 10px 24px #173f3838}
    #result,.tangram-leave-confirm{position:fixed;z-index:80;inset:0 auto auto 50%;width:min(100vw,920px);max-width:none;height:100dvh;max-height:none;margin:0;padding:16px;transform:translateX(-50%);border:0;border-radius:0;background:#0b2e29aa;display:grid;place-items:center;overflow:hidden;backdrop-filter:blur(4px)}
    #result:not([open]),.tangram-leave-confirm.hidden{display:none!important}
    .tangram-result-card,.tangram-leave-card{width:min(430px,calc(100% - 28px));max-height:calc(100% - 24px);padding:24px;display:grid;gap:12px;overflow-y:auto;overscroll-behavior:contain;border-radius:25px;background:#fbfff3;color:#173f38;text-align:center;box-shadow:0 28px 80px #10372f77}
    #result>.tangram-result-card{display:grid;justify-content:stretch;margin-top:0}
    .tangram-result-card>*,.tangram-leave-card>*{margin-block:0}
    .tangram-result-actions{position:sticky;bottom:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding-top:5px;background:#fbfff3}
    .tangram-result-actions button,.tangram-leave-actions button{min-width:0;min-height:48px;padding:8px 6px;border:1px solid #a8c7b0;border-radius:12px;background:#fafff4;color:#173f38;font-weight:850;line-height:1.15;overflow-wrap:anywhere}
    .tangram-result-actions .primary,.tangram-leave-actions .primary{background:#1c6b5c;color:#fff}
    .tangram-result-actions button:disabled{opacity:.48;box-shadow:none;cursor:not-allowed}
    .tangram-leave-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
    #result :focus-visible,.tangram-leave-confirm :focus-visible{outline:4px solid #ffd75e;outline-offset:3px}
    body.tangram-result-active .wp-generated-battle-header,body.tangram-leave-active .wp-generated-battle-header{visibility:hidden!important;pointer-events:none!important}
    @media(max-height:560px){.tangram-result-card{width:min(680px,calc(100% - 40px));padding:18px 24px;gap:8px}.tangram-result-card .result-mark{width:108px;height:64px;margin-bottom:0}.tangram-leave-card{width:min(520px,calc(100% - 40px))}}
  `;
  document.head.append(artStyle);
  const animalNames={
    en:["Turtle","Cat","Bird","Fox","Fish","Rabbit"],"zh-Hant":["海龜","小貓","小鳥","狐狸","小魚","兔子"],"zh-Hans":["海龟","小猫","小鸟","狐狸","小鱼","兔子"],
    ja:["カメ","ネコ","トリ","キツネ","サカナ","ウサギ"],ko:["거북이","고양이","새","여우","물고기","토끼"],es:["Tortuga","Gato","Ave","Zorro","Pez","Conejo"],
    "pt-BR":["Tartaruga","Gato","Ave","Raposa","Peixe","Coelho"],fr:["Tortue","Chat","Oiseau","Renard","Poisson","Lapin"],de:["Schildkröte","Katze","Vogel","Fuchs","Fisch","Hase"],
    it:["Tartaruga","Gatto","Uccello","Volpe","Pesce","Coniglio"],ru:["Черепаха","Кошка","Птица","Лиса","Рыба","Кролик"],hi:["कछुआ","बिल्ली","पक्षी","लोमड़ी","मछली","खरगोश"],ar:["سلحفاة","قطة","طائر","ثعلب","سمكة","أرنب"]
  };
  const navigationCopy={
    en:{stages:"Stages",leaveTitle:"Leave this shape?",leaveBody:"Your current piece positions will be reset.",keepPlaying:"Keep playing",leaveStage:"Leave to stages"},
    "zh-Hant":{stages:"關卡",leaveTitle:"要離開這個拼圖嗎？",leaveBody:"目前的拼圖片位置將會重設。",keepPlaying:"繼續遊戲",leaveStage:"離開到關卡"},
    "zh-Hans":{stages:"关卡",leaveTitle:"要离开这个拼图吗？",leaveBody:"当前的拼图片位置将会重置。",keepPlaying:"继续游戏",leaveStage:"离开到关卡"},
    ja:{stages:"ステージ",leaveTitle:"このパズルを離れますか？",leaveBody:"現在のピース位置はリセットされます。",keepPlaying:"続ける",leaveStage:"ステージへ戻る"},
    ko:{stages:"스테이지",leaveTitle:"이 퍼즐을 나갈까요?",leaveBody:"현재 조각 위치가 초기화됩니다.",keepPlaying:"계속하기",leaveStage:"스테이지로 나가기"},
    es:{stages:"Niveles",leaveTitle:"¿Salir de esta figura?",leaveBody:"Se restablecerán las posiciones actuales.",keepPlaying:"Seguir jugando",leaveStage:"Salir a niveles"},
    "pt-BR":{stages:"Fases",leaveTitle:"Sair desta forma?",leaveBody:"As posições atuais serão reiniciadas.",keepPlaying:"Continuar jogando",leaveStage:"Sair para fases"},
    fr:{stages:"Niveaux",leaveTitle:"Quitter cette forme ?",leaveBody:"Les positions actuelles seront réinitialisées.",keepPlaying:"Continuer",leaveStage:"Quitter vers les niveaux"},
    de:{stages:"Level",leaveTitle:"Diese Form verlassen?",leaveBody:"Die aktuellen Teilepositionen werden zurückgesetzt.",keepPlaying:"Weiterspielen",leaveStage:"Zu den Leveln"},
    it:{stages:"Livelli",leaveTitle:"Uscire da questa forma?",leaveBody:"Le posizioni attuali verranno ripristinate.",keepPlaying:"Continua",leaveStage:"Vai ai livelli"},
    ru:{stages:"Уровни",leaveTitle:"Выйти из этой фигуры?",leaveBody:"Текущие позиции деталей будут сброшены.",keepPlaying:"Продолжить",leaveStage:"К уровням"},
    hi:{stages:"स्तर",leaveTitle:"इस आकृति से बाहर जाएँ?",leaveBody:"मौजूदा टुकड़ों की जगह रीसेट हो जाएगी।",keepPlaying:"खेलते रहें",leaveStage:"स्तरों पर जाएँ"},
    ar:{stages:"المراحل",leaveTitle:"مغادرة هذا الشكل؟",leaveBody:"ستتم إعادة ضبط مواضع القطع الحالية.",keepPlaying:"متابعة اللعب",leaveStage:"العودة للمراحل"}
  };
  const coachCopy={
    en:"1 Drag to the same-color shadow. 2 Tap to turn.",
    "zh-Hant":"1 拖到同色影子　2 點一下旋轉",
    "zh-Hans":"1 拖到同色影子　2 点一下旋转",
    ja:"1 同じ色の影へドラッグ　2 タップで回転",
    ko:"1 같은 색 그림자로 끌기　2 탭해서 회전",
    es:"1 Arrastra a la sombra del mismo color. 2 Toca para girar.",
    "pt-BR":"1 Arraste até a sombra da mesma cor. 2 Toque para girar.",
    fr:"1 Glisse vers l’ombre de même couleur. 2 Touche pour tourner.",
    de:"1 Ziehe zum Schatten gleicher Farbe. 2 Tippe zum Drehen.",
    it:"1 Trascina sull’ombra dello stesso colore. 2 Tocca per ruotare.",
    ru:"1 Перетащи на тень того же цвета. 2 Нажми, чтобы повернуть.",
    hi:"1 उसी रंग की छाया तक खींचें। 2 घुमाने के लिए टैप करें।",
    ar:"1 اسحب إلى الظل من اللون نفسه. 2 اضغط للتدوير."
  };
  let locale=read("wp-locale")||"en";if(!codes.includes(locale))locale="en";let unlocked=Number(read(key))||1,selected=Math.min(unlocked,30)-1,level=null,states=[],moves=0,drag=null,resultTimer=0,resultSettled=false,leaveOpen=false,leaveTrigger=null;
  function read(k){try{return localStorage.getItem(k)}catch{return null}}function write(k,v){try{localStorage.setItem(k,v)}catch{}}
  function t(k,v={}){const value=window.TANGRAM_LOCALES[locale]?.[k]??window.TANGRAM_LOCALES.en[k]??k;return String(value).replace(/\{(\w+)\}/g,(_,n)=>v[n]??"")}
  function nav(k){return navigationCopy[locale]?.[k]||navigationCopy.en[k]}
  function coach(){return coachCopy[locale]||coachCopy.en}
  const result=$("#result"),legacyResultActions=result.lastElementChild,resultCard=document.createElement("div"),resultStages=document.createElement("button");
  resultCard.className="tangram-result-card";
  resultStages.id="resultStages";
  resultStages.type="button";
  legacyResultActions.className="tangram-result-actions";
  legacyResultActions.replaceChildren(resultStages,$("#next"),$("#retry"));
  [...result.children].forEach(node=>resultCard.append(node));
  result.append(resultCard);
  result.classList.add("result-overlay");
  $("#battle").setAttribute("data-play-viewport","");
  $("#battle").append(result);
  result.setAttribute("aria-modal","true");
  result.setAttribute("aria-labelledby","resultTitle");
  const leavePanel=document.createElement("section");
  leavePanel.className="tangram-leave-confirm hidden";
  leavePanel.setAttribute("role","dialog");
  leavePanel.setAttribute("aria-modal","true");
  leavePanel.setAttribute("aria-labelledby","tangramLeaveTitle");
  leavePanel.innerHTML='<div class="tangram-leave-card"><h2 id="tangramLeaveTitle"></h2><p id="tangramLeaveBody"></p><div class="tangram-leave-actions"><button id="tangramKeepPlaying" class="primary" type="button"></button><button id="tangramLeaveStage" type="button"></button></div></div>';
  document.body.append(leavePanel);
  function setBattleOwnership(active){[$("#battle .scene-header"),$("#battle .battle-content")].forEach(node=>{if(!node)return;node.inert=active;if(active)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden")})}
  function closeResult(){result.removeAttribute("open");document.body.classList.remove("tangram-result-active");setBattleOwnership(false)}
  function openResult(){result.setAttribute("open","");document.body.classList.add("tangram-result-active");setBattleOwnership(true);requestAnimationFrame(()=>(result.querySelector(".primary")||resultStages).focus({preventScroll:true}))}
  function closeLeave(restore=true){if(!leaveOpen)return;leaveOpen=false;leavePanel.classList.add("hidden");document.body.classList.remove("tangram-leave-active");setBattleOwnership(false);const target=leaveTrigger;leaveTrigger=null;if(restore&&target?.isConnected)requestAnimationFrame(()=>target.focus({preventScroll:true}))}
  function openLeave(){if(leaveOpen||result.hasAttribute("open"))return;leaveTrigger=document.activeElement instanceof HTMLElement?document.activeElement:null;leaveOpen=true;setBattleOwnership(true);document.body.classList.add("tangram-leave-active");leavePanel.classList.remove("hidden");requestAnimationFrame(()=>$("#tangramKeepPlaying").focus({preventScroll:true}))}
  function show(id,focus=true){clearTimeout(resultTimer);resultTimer=0;closeResult();closeLeave(false);screens.forEach(screen=>screen.hidden=screen.id!==id);document.body.dataset.screen=id;if(id==="stage")renderStages();if(focus)requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=id==="main"?$("#start"):id==="stage"?$("#stageGrid .stage-card.selected:not(:disabled)"):null;target?.focus({preventScroll:true})}))}
  function animalName(index){return (animalNames[locale]||animalNames.en)[index%6]}
  function createShape(className,index,target,preview=false){const shape=document.createElement(preview?"span":"div");shape.className=className+" "+parts[index];shape.dataset.shape=parts[index];pos(shape,target.x,target.y,target.r);return shape}
  function createPreview(item){const preview=document.createElement("span");preview.className="stage-preview";preview.setAttribute("aria-hidden","true");item.targets.forEach((target,index)=>preview.append(createShape("preview-piece",index,target,true)));return preview}
  function renderStages(){$("#progress").textContent=t("progress",{done:Math.min(unlocked-1,30)});$("#stageGrid").innerHTML="";levels.forEach((item,index)=>{const b=document.createElement("button"),locked=index+1>unlocked;b.className="stage-card"+(index===selected?" selected":"");b.disabled=locked;b.dataset.stage=String(index+1);b.append(createPreview(item));const copy=document.createElement("span");copy.className="stage-copy";copy.innerHTML="<strong>"+animalName(index)+"</strong><span>"+t("shape",{n:index+1})+(locked?" · "+t("locked"):"")+"</span>";b.append(copy);b.onclick=()=>startLevel(index);$("#stageGrid").append(b)});requestAnimationFrame(()=>$("#stageGrid .selected")?.scrollIntoView({block:"nearest",inline:"center"}))}
  function pos(el,x,y,r){el.style.left=x*100+"%";el.style.top=y*100+"%";el.style.transform="translate(-50%,-50%) rotate("+r+"deg)"}
  function startLevel(index){selected=index;level=levels[index];const tray=[[.14,.82],[.42,.82],[.72,.82],[.12,.94],[.31,.94],[.53,.94],[.78,.94]];states=parts.map((_,i)=>({x:tray[i][0],y:tray[i][1],r:0,placed:false}));moves=0;resultSettled=false;$("#chapter").textContent=t("chapter",{n:Math.floor(index/5)+1});$("#stageName").textContent=t("shape",{n:index+1});$("#animalGoal").textContent=animalName(index);$("#status").textContent=coach();show("battle",false);renderBoard();requestAnimationFrame(()=>$(".piece:not(.placed)")?.focus({preventScroll:true}))}
  function renderBoard(focusIndex=null){const targets=$("#targets"),piecesLayer=$("#pieces");targets.innerHTML="";piecesLayer.innerHTML="";level.targets.forEach((target,index)=>targets.append(createShape("target-piece",index,target)));states.forEach((state,index)=>{const piece=document.createElement("button");piece.className="piece "+parts[index]+(state.placed?" placed":"");piece.dataset.shape=parts[index];piece.dataset.index=index;piece.setAttribute("aria-label",t("pieceLabel",{n:index+1}));pos(piece,state.x,state.y,state.r);piece.onpointerdown=event=>begin(index,event);piece.onpointermove=event=>move(event);piece.onpointerup=finish;piece.onpointercancel=finish;piece.onclick=event=>{if(event.detail===0)rotatePiece(index)};piecesLayer.append(piece)});$("#placedCount").textContent=t("placed",{done:states.filter(state=>state.placed).length});if(focusIndex!==null)requestAnimationFrame(()=>document.querySelector('[data-index="'+focusIndex+'"]')?.focus({preventScroll:true}))}
  function begin(index,event){const state=states[index];state.placed=false;drag={index,pointer:event.pointerId,x:event.clientX,y:event.clientY,startX:state.x,startY:state.y,moved:false};event.currentTarget.setPointerCapture?.(event.pointerId);event.currentTarget.classList.remove("placed");document.querySelector('.target-piece[data-shape="'+parts[index]+'"]')?.classList.add("active-target")}
  function move(event){if(!drag)return;const rect=$("#board").getBoundingClientRect(),state=states[drag.index];state.x=Math.max(.07,Math.min(.93,drag.startX+(event.clientX-drag.x)/rect.width));state.y=Math.max(.07,Math.min(.93,drag.startY+(event.clientY-drag.y)/rect.height));drag.moved=true;const piece=document.querySelector('[data-index="'+drag.index+'"]');if(piece)pos(piece,state.x,state.y,state.r)}
  function rotatePiece(index){if(states[index].placed)return;states[index].r=(states[index].r+45)%360;$("#status").textContent=coach();renderBoard(index)}
  function finish(){if(!drag)return;const index=drag.index,state=states[index],target=level.targets[index],angle=Math.abs(((state.r-target.r+540)%360)-180),distance=Math.hypot(state.x-target.x,state.y-target.y),moved=drag.moved;drag=null;if(!moved){rotatePiece(index)}else if(distance<.075&&angle<=1){state.x=target.x;state.y=target.y;state.r=target.r;state.placed=true;moves++;$("#status").textContent=t("snap");renderBoard();checkComplete()}else{$("#status").textContent=t("wrong");renderBoard(index)}}
  function checkComplete(){if(states.every(state=>state.placed)){if(selected+2>unlocked){unlocked=Math.min(31,selected+2);write(key,String(unlocked))}$("#resultBody").textContent=t("resultBody",{n:selected+1,moves});const terminal=selected===29;$("#next").textContent=terminal?t("allDone"):t("next");$("#next").disabled=terminal;$("#next").setAttribute("aria-disabled",String(terminal));$("#next").classList.toggle("primary",!terminal);resultStages.classList.toggle("primary",terminal);$("#retry").classList.remove("primary");resultTimer=setTimeout(openResult,180)}}
  function hint(){const index=states.findIndex(state=>!state.placed);if(index<0)return;const target=level.targets[index];states[index]={x:target.x,y:target.y,r:target.r,placed:true};moves++;$("#status").textContent=t("snap");renderBoard();checkComplete()}
  function applyLocale(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=t("title")+" | WeightPlay";document.querySelectorAll("[data-t]").forEach(node=>node.textContent=t(node.dataset.t));document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));$("#locale").value=locale;resultStages.textContent=nav("stages");$("#tangramLeaveTitle").textContent=nav("leaveTitle");$("#tangramLeaveBody").textContent=nav("leaveBody");$("#tangramKeepPlaying").textContent=nav("keepPlaying");$("#tangramLeaveStage").textContent=nav("leaveStage");if(!$("#stage").hidden)renderStages();if(!$("#battle").hidden)renderBoard()}
  codes.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=window.TANGRAM_LOCALES[code].label;$("#locale").append(option)});$("#locale").onchange=e=>{locale=e.target.value;write("wp-locale",locale);applyLocale()};
  function settleResult(action){if(resultSettled||!result.hasAttribute("open"))return;resultSettled=true;action()}
  function trapFocus(event,root){const actions=[...root.querySelectorAll("button:not(:disabled),a[href],select")].filter(node=>node.getClientRects().length);if(event.key!=="Tab"||!actions.length)return;const first=actions[0],last=actions.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
  $("#start").onclick=()=>show("stage");
  $("#stage [data-back]").onclick=()=>show("main");
  document.addEventListener("click",event=>{if(document.body.dataset.screen!=="battle"||!event.target.closest("[data-back]"))return;event.preventDefault();event.stopImmediatePropagation();openLeave()},true);
  $("#hint").onclick=hint;
  $("#reset").onclick=()=>startLevel(selected);
  resultStages.onclick=()=>settleResult(()=>{selected=Math.min(unlocked,30)-1;show("stage")});
  $("#retry").onclick=()=>settleResult(()=>startLevel(selected));
  $("#next").onclick=()=>{if($("#next").disabled)return;settleResult(()=>startLevel(selected+1))};
  $("#tangramKeepPlaying").onclick=()=>closeLeave(true);
  $("#tangramLeaveStage").onclick=()=>{closeLeave(false);show("stage")};
  result.addEventListener("keydown",event=>trapFocus(event,result));
  leavePanel.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();closeLeave(true);return}trapFocus(event,leavePanel)});
  applyLocale();show("main",false);
})();
