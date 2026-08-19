(()=>{
  "use strict";

  const battleLive=document.querySelector("#battleScreen .battle-live");
  const specs=[
    {node:document.querySelector("#helpModal"),title:"helpModalTitle",restore:true,escape:"#helpClose"},
    {node:document.querySelector("#leaveModal"),title:"leaveModalTitle",restore:true,escape:"#leaveContinue"},
    {node:document.querySelector("#resultModal"),title:"resultModalTitle",restore:false,escape:""}
  ];
  let active=null;
  let returnFocus=null;
  let resultDecisionCommitted=false;
  let resultWasOpen=false;
  const heldDecisionKeys=new Set();
  const stageRail=document.querySelector("#stageRail");
  const arena=document.querySelector("#arena");
  const boardDescription=document.createElement("p");
  boardDescription.id="crateBoardDescription";
  boardDescription.className="sr-only";
  boardDescription.setAttribute("aria-live","polite");
  boardDescription.setAttribute("aria-atomic","true");
  arena?.insertAdjacentElement("afterend",boardDescription);
  arena?.setAttribute("aria-describedby",boardDescription.id);
  arena?.setAttribute("tabindex","0");
  arena?.setAttribute("aria-keyshortcuts","ArrowUp ArrowDown ArrowLeft ArrowRight W A S D Shift");

  const boardCopy={
    en:{coordinates:"Coordinates use row,column from the top left",rux:"Rux",cargo:"Cargo",docks:"Docks",rubble:"Interior rubble",devices:"Devices",none:"none",linked:"linked",ice:"ice",switches:"switches",gateOpen:"open gate",gateClosed:"closed gate",belts:"belts",docked:"Docked",moves:"Moves",pulls:"Pulls"},
    "zh-Hant":{coordinates:"座標由左上起依序為列、欄",rux:"Rux",cargo:"貨箱",docks:"碼頭",rubble:"內部碎石",devices:"裝置",none:"無",linked:"連動",ice:"冰軌",switches:"開關",gateOpen:"已開閘門",gateClosed:"關閉閘門",belts:"輸送帶",docked:"已停靠",moves:"步數",pulls:"拉取"},
    "zh-Hans":{coordinates:"坐标从左上起依次为行、列",rux:"Rux",cargo:"货箱",docks:"码头",rubble:"内部碎石",devices:"装置",none:"无",linked:"联动",ice:"冰轨",switches:"开关",gateOpen:"已开闸门",gateClosed:"关闭闸门",belts:"传送带",docked:"已停靠",moves:"步数",pulls:"拉取"},
    ja:{coordinates:"座標は左上から行、列の順",rux:"Rux",cargo:"荷箱",docks:"ドック",rubble:"内側の瓦礫",devices:"装置",none:"なし",linked:"連動",ice:"氷レール",switches:"スイッチ",gateOpen:"開いたゲート",gateClosed:"閉じたゲート",belts:"ベルト",docked:"搬入済み",moves:"手数",pulls:"プル"},
    ko:{coordinates:"좌표는 왼쪽 위부터 행,열 순서",rux:"Rux",cargo:"화물",docks:"도크",rubble:"내부 잔해",devices:"장치",none:"없음",linked:"연결",ice:"얼음 레일",switches:"스위치",gateOpen:"열린 문",gateClosed:"닫힌 문",belts:"벨트",docked:"도킹",moves:"이동",pulls:"당기기"},
    es:{coordinates:"Las coordenadas son fila,columna desde arriba a la izquierda",rux:"Rux",cargo:"Cargas",docks:"Muelles",rubble:"Escombros interiores",devices:"Dispositivos",none:"ninguno",linked:"enlazada",ice:"hielo",switches:"interruptores",gateOpen:"puerta abierta",gateClosed:"puerta cerrada",belts:"cintas",docked:"Atracadas",moves:"Movimientos",pulls:"Tirones"},
    "pt-BR":{coordinates:"As coordenadas usam linha,coluna a partir do canto superior esquerdo",rux:"Rux",cargo:"Cargas",docks:"Docas",rubble:"Entulho interno",devices:"Dispositivos",none:"nenhum",linked:"ligada",ice:"gelo",switches:"interruptores",gateOpen:"portão aberto",gateClosed:"portão fechado",belts:"esteiras",docked:"Atracadas",moves:"Movimentos",pulls:"Puxões"},
    fr:{coordinates:"Les coordonnées indiquent ligne,colonne depuis le coin supérieur gauche",rux:"Rux",cargo:"Caisses",docks:"Quais",rubble:"Décombres intérieurs",devices:"Dispositifs",none:"aucun",linked:"liée",ice:"glace",switches:"interrupteurs",gateOpen:"porte ouverte",gateClosed:"porte fermée",belts:"convoyeurs",docked:"Arrimées",moves:"Mouvements",pulls:"Tirages"},
    de:{coordinates:"Koordinaten sind Zeile,Spalte von links oben",rux:"Rux",cargo:"Fracht",docks:"Docks",rubble:"Inneres Geröll",devices:"Vorrichtungen",none:"keine",linked:"gekoppelt",ice:"Eis",switches:"Schalter",gateOpen:"offenes Tor",gateClosed:"geschlossenes Tor",belts:"Bänder",docked:"Angedockt",moves:"Züge",pulls:"Ziehen"},
    it:{coordinates:"Le coordinate sono riga,colonna dall'angolo in alto a sinistra",rux:"Rux",cargo:"Casse",docks:"Moli",rubble:"Macerie interne",devices:"Dispositivi",none:"nessuno",linked:"collegata",ice:"ghiaccio",switches:"interruttori",gateOpen:"cancello aperto",gateClosed:"cancello chiuso",belts:"nastri",docked:"Attraccate",moves:"Mosse",pulls:"Tiri"},
    ru:{coordinates:"Координаты: строка,столбец от левого верхнего угла",rux:"Rux",cargo:"Грузы",docks:"Док-станции",rubble:"Внутренние обломки",devices:"Устройства",none:"нет",linked:"связанный",ice:"лёд",switches:"переключатели",gateOpen:"открытые ворота",gateClosed:"закрытые ворота",belts:"ленты",docked:"Доставлено",moves:"Ходы",pulls:"Притягивания"},
    hi:{coordinates:"निर्देशांक ऊपर बाएँ से पंक्ति,स्तंभ हैं",rux:"Rux",cargo:"माल",docks:"डॉक",rubble:"भीतरी मलबा",devices:"उपकरण",none:"कोई नहीं",linked:"जुड़ा",ice:"बर्फ़ रेल",switches:"स्विच",gateOpen:"खुला द्वार",gateClosed:"बंद द्वार",belts:"पट्टियाँ",docked:"डॉक किया",moves:"चालें",pulls:"खींचाव"},
    ar:{coordinates:"الإحداثيات صف،عمود من أعلى اليسار",rux:"روكس",cargo:"الصناديق",docks:"الأرصفة",rubble:"الركام الداخلي",devices:"الأجهزة",none:"لا يوجد",linked:"مترابط",ice:"الجليد",switches:"المفاتيح",gateOpen:"بوابة مفتوحة",gateClosed:"بوابة مغلقة",belts:"الأحزمة",docked:"تم الإرساء",moves:"الحركات",pulls:"السحبات"}
  };
  let boardDescriptionFrame=0;

  function activeLocale(){
    return window.WonderI18n?.actualLocale?.()||window.WonderI18n?.locale?.()||document.documentElement.lang||"en";
  }

  function syncBoardDescription(){
    boardDescriptionFrame=0;
    const state=window.__blockTrilogyTest?.getState?.();
    const engine=state?.engine;
    if(state?.id!=="animal-cratebound"||state.screen!=="battle"||engine?.kind!=="crate")return;
    const copy=boardCopy[activeLocale()]||boardCopy.en;
    const point=item=>`${item.y+1},${item.x+1}`;
    const list=items=>items.length?items.map(point).join("; "):copy.none;
    const cargo=engine.boxes.map((box,index)=>`#${index+1} ${point(box)}${box.linked?` (${copy.linked})`:""}`).join("; ")||copy.none;
    const devices=[];
    if(engine.ice.length)devices.push(`${copy.ice} ${list(engine.ice)}`);
    if(engine.switches.length)devices.push(`${copy.switches} ${list(engine.switches)}`);
    if(engine.gate)devices.push(`${engine.gate.open?copy.gateOpen:copy.gateClosed} ${point(engine.gate)}`);
    if(engine.belts.length)devices.push(`${copy.belts} ${engine.belts.map(belt=>`${point(belt)}${belt.dx>0?"→":belt.dx<0?"←":belt.dy>0?"↓":"↑"}`).join("; ")}`);
    const docked=engine.goals.filter(goal=>engine.boxes.some(box=>box.x===goal.x&&box.y===goal.y)).length;
    boardDescription.textContent=`${engine.size}×${engine.size}. ${copy.coordinates}. ${copy.rux} ${point(engine.player)}. ${copy.cargo}: ${cargo}. ${copy.docks}: ${list(engine.goals)}. ${copy.rubble}: ${list(engine.walls)}. ${copy.devices}: ${devices.join("; ")||copy.none}. ${copy.docked} ${docked}/${engine.goals.length}. ${copy.moves} ${engine.moves}. ${copy.pulls} ${engine.pulls}.`;
  }

  function scheduleBoardDescription(){
    if(boardDescriptionFrame)return;
    boardDescriptionFrame=requestAnimationFrame(syncBoardDescription);
  }

  ["statA","statB","statC","stageLabel"].forEach(id=>{
    const node=document.getElementById(id);
    if(node)new MutationObserver(scheduleBoardDescription).observe(node,{childList:true,subtree:true,characterData:true});
  });
  document.addEventListener("click",event=>{
    if(event.target.closest?.("#battleControls,#stageRail,#retry,#next"))scheduleBoardDescription();
  },true);
  document.addEventListener("keydown",event=>{
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D","Shift"].includes(event.key))scheduleBoardDescription();
  },true);
  window.addEventListener("wonder:locale-change",scheduleBoardDescription);
  document.getElementById("localeSelect")?.addEventListener("change",scheduleBoardDescription);

  const visible=spec=>spec.node&&!spec.node.hidden;
  const actions=modal=>[...modal.querySelectorAll('button:not(:disabled),a[href],select:not(:disabled),[tabindex]:not([tabindex="-1"])')]
    .filter(node=>node.getClientRects().length);

  function setBattleCovered(covered){
    if(!battleLive)return;
    battleLive.inert=covered;
    if(covered)battleLive.setAttribute("aria-hidden","true");
    else battleLive.removeAttribute("aria-hidden");
  }

  function stageCards(){
    return stageRail?[...stageRail.querySelectorAll(".stage-card")]:[];
  }

  function syncStageTabOwner(preferred=null){
    const cards=stageCards();
    if(!cards.length)return;
    const owner=preferred&&cards.includes(preferred)
      ?preferred
      :cards.find(card=>card.getAttribute("aria-current")==="true"||card.classList.contains("centered"))||cards[0];
    cards.forEach(card=>{
      card.tabIndex=card===owner?0:-1;
      card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");
    });
  }

  stageRail?.addEventListener("keydown",event=>{
    const card=event.target.closest?.(".stage-card");
    if(!card)return;
    const cards=stageCards();
    const current=cards.indexOf(card);
    if(current<0)return;
    const rtl=getComputedStyle(stageRail).direction==="rtl";
    const delta=event.key==="ArrowLeft"?(rtl?1:-1):event.key==="ArrowRight"?(rtl?-1:1):0;
    let target=null;
    if(delta)target=cards[Math.max(0,Math.min(cards.length-1,current+delta))];
    else if(event.key==="Home")target=cards[0];
    else if(event.key==="End")target=cards.at(-1);
    if(!target)return;
    event.preventDefault();
    target.click();
    syncStageTabOwner(target);
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:"instant",inline:"center",block:"nearest"});
  },true);

  stageRail?.addEventListener("focusin",event=>{
    const card=event.target.closest?.(".stage-card");
    if(!card)return;
    if(card.getAttribute("aria-current")!=="true")card.click();
    syncStageTabOwner(card);
  });

  if(stageRail){
    new MutationObserver(()=>syncStageTabOwner()).observe(stageRail,{childList:true,subtree:true,attributes:true,attributeFilter:["aria-current","class"]});
    syncStageTabOwner();
  }

  function sync(){
    const resultOpen=visible(specs[2]);
    if(resultOpen&&!resultWasOpen)resultDecisionCommitted=false;
    resultWasOpen=resultOpen;
    const next=specs.find(visible)||null;
    if(next===active)return;
    const previous=active;
    active=next;
    if(next){
      if(!previous)returnFocus=document.activeElement;
      setBattleCovered(true);
      requestAnimationFrame(()=>{
        if(active!==next||next.node.contains(document.activeElement))return;
        actions(next.node)[0]?.focus({preventScroll:true});
      });
      return;
    }
    setBattleCovered(false);
    const target=returnFocus;
    returnFocus=null;
    if(previous?.restore&&target?.isConnected&&target.getClientRects().length){
      requestAnimationFrame(()=>target.focus({preventScroll:true}));
    }
  }

  for(const spec of specs){
    if(!spec.node)continue;
    const heading=spec.node.querySelector("h2");
    if(heading){
      if(!heading.id)heading.id=spec.title;
      spec.node.setAttribute("aria-labelledby",heading.id);
    }
    spec.node.setAttribute("role","dialog");
    spec.node.setAttribute("aria-modal","true");
    new MutationObserver(sync).observe(spec.node,{attributes:true,attributeFilter:["hidden"]});
  }

  const decisionKey=event=>event.key==="Enter"||event.key===" "?event.key:"";
  const decisionTarget=target=>target instanceof Element&&Boolean(target.closest("#battleHelp,#battleBack,#helpModal button,#leaveModal button,#resultModal button"));

  document.addEventListener("keydown",event=>{
    const key=decisionKey(event);
    if(!key)return;
    const owned=Boolean(active)||decisionTarget(event.target);
    if(!owned)return;
    if(heldDecisionKeys.has(key)){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    heldDecisionKeys.add(key);
  },true);

  document.addEventListener("keyup",event=>{
    const key=decisionKey(event);
    if(key)heldDecisionKeys.delete(key);
  },true);
  window.addEventListener("blur",()=>heldDecisionKeys.clear());
  document.addEventListener("visibilitychange",()=>{if(document.hidden)heldDecisionKeys.clear();});

  document.addEventListener("click",event=>{
    const resultAction=event.target.closest?.("#resultModal button");
    if(!resultAction)return;
    if(resultDecisionCommitted||specs[2].node?.hidden){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    resultDecisionCommitted=true;
  },true);

  document.addEventListener("keydown",event=>{
    if(!active)return;
    if(event.key==="Escape"){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(active.escape)active.node.querySelector(active.escape)?.click();
      return;
    }
    if(event.key!=="Tab")return;
    const available=actions(active.node);
    if(!available.length){event.preventDefault();active.node.focus({preventScroll:true});return;}
    const first=available[0],last=available.at(-1);
    if(event.shiftKey&&(document.activeElement===first||!active.node.contains(document.activeElement))){
      event.preventDefault();
      last.focus({preventScroll:true});
    }else if(!event.shiftKey&&(document.activeElement===last||!active.node.contains(document.activeElement))){
      event.preventDefault();
      first.focus({preventScroll:true});
    }
  },true);

  for(const eventName of ["pointerdown","pointerup","click"]){
    battleLive?.addEventListener(eventName,event=>{
      if(!active)return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },true);
  }

  sync();
  scheduleBoardDescription();
})();
