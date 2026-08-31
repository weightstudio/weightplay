(() => {
  "use strict";

  const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||"en";
  const rows={
    en:["Paint","Mark ×","Undo","Hint","Restart","That cell conflicts with the clues.","Hint: one certain cell was painted.","Every filled cell is already visible.","Nothing to undo."],
    "zh-Hant":["填色","標記 ×","復原","提示","重新開始","該格與線索衝突。","提示：已填上一個可確定的格子。","所有應填格都已顯示。","沒有可復原的步驟。"],
    "zh-Hans":["填色","标记 ×","撤销","提示","重新开始","该格与线索冲突。","提示：已填上一个可确定的格子。","所有应填格都已显示。","没有可撤销的步骤。"],
    ja:["塗る","印 ×","元に戻す","ヒント","やり直す","このマスは手掛かりと矛盾します。","ヒント：確定できるマスを1つ塗りました。","塗るべきマスはすべて表示済みです。","元に戻せる手順がありません。"],
    ko:["칠하기","표시 ×","실행 취소","힌트","다시 시작","이 칸은 단서와 맞지 않습니다.","힌트: 확실한 칸 하나를 칠했습니다.","채울 칸이 모두 표시되었습니다.","취소할 단계가 없습니다."],
    es:["Pintar","Marcar ×","Deshacer","Pista","Reiniciar","Esta casilla contradice las pistas.","Pista: se pintó una casilla segura.","Todas las casillas rellenas ya están visibles.","No hay nada que deshacer."],
    "pt-BR":["Pintar","Marcar ×","Desfazer","Dica","Reiniciar","Esta célula contradiz as pistas.","Dica: uma célula certa foi pintada.","Todas as células preenchidas já estão visíveis.","Não há nada para desfazer."],
    fr:["Peindre","Marquer ×","Annuler","Indice","Recommencer","Cette case contredit les indices.","Indice : une case certaine a été peinte.","Toutes les cases remplies sont déjà visibles.","Rien à annuler."],
    de:["Färben","Markieren ×","Rückgängig","Hinweis","Neustart","Dieses Feld widerspricht den Hinweisen.","Hinweis: Ein sicheres Feld wurde gefärbt.","Alle gefüllten Felder sind bereits sichtbar.","Nichts rückgängig zu machen."],
    it:["Colora","Segna ×","Annulla","Indizio","Ricomincia","Questa casella contraddice gli indizi.","Indizio: è stata colorata una casella certa.","Tutte le caselle piene sono già visibili.","Niente da annullare."],
    ru:["Закрасить","Отметить ×","Отменить","Подсказка","Начать заново","Эта клетка противоречит подсказкам.","Подсказка: закрашена одна однозначная клетка.","Все заполненные клетки уже видны.","Нечего отменять."],
    hi:["रंग भरें","चिह्न ×","पूर्ववत","संकेत","फिर शुरू करें","यह खाना संकेतों से मेल नहीं खाता।","संकेत: एक निश्चित खाने में रंग भरा गया।","सभी भरे हुए खाने पहले ही दिखाई दे रहे हैं।","पूर्ववत करने के लिए कुछ नहीं है।"],
    ar:["تلوين","علامة ×","تراجع","تلميح","إعادة البدء","هذه الخانة تتعارض مع التلميحات.","تلميح: تم تلوين خانة مؤكدة.","كل الخانات المملوءة ظاهرة بالفعل.","لا يوجد شيء للتراجع عنه."]
  };
  const source=rows.en,copy=rows[locale]||source,exact=new Map(source.map((value,index)=>[value,copy[index]]));
  if(locale==="en")return;
  const translateNode=node=>{
    if(node.nodeType!==Node.TEXT_NODE||["SCRIPT","STYLE","NOSCRIPT"].includes(node.parentElement?.tagName||""))return;
    const leading=node.data.match(/^\s*/u)?.[0]||"",trailing=node.data.match(/\s*$/u)?.[0]||"",core=node.data.slice(leading.length,node.data.length-trailing.length||undefined),next=exact.get(core);
    if(next&&next!==core)node.data=`${leading}${next}${trailing}`;
  };
  const translateTree=root=>{translateNode(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode)};
  translateTree(document.body);
  new MutationObserver(records=>records.forEach(record=>record.type==="characterData"?translateNode(record.target):record.addedNodes.forEach(translateTree))).observe(document.body,{childList:true,subtree:true,characterData:true});
  window.WeightPlayGameRuntimeLocalizer=Object.freeze({locale,translate:value=>exact.get(value)||value,translateTree});
})();

// Interface V6 installs the game-owned bounded Stage renderer before the
// shared trilogy runtime asks for its Stage implementation.
(()=>{
  "use strict";
  const TOTAL=30,POOL=9,clamp=(value,min=1,max=TOTAL)=>Math.max(min,Math.min(max,value));
  let api=null,cards=[],windowStart=1,settleRaf=0;
  const desired=stage=>clamp(stage-Math.floor(POOL/2),1,TOTAL-POOL+1);
  const status=(stage,save)=>stage>save.unlocked?"Locked":save.cleared[stage]?"Cleared · Replay":"Ready";
  function createCard(){
    const button=document.createElement("button");
    button.type="button";button.className="stage-card";button.innerHTML="<small></small><strong></strong><span></span>";
    button.addEventListener("click",()=>{const stage=Number(button.dataset.stage);if(!stage)return;if(stage!==api.getCentered()){select(stage,true);return}if(stage>api.save.unlocked){api.announce("Complete the previous stage first.");return}api.enter(stage)});
    return button;
  }
  function bind(button,stage){
    const locked=stage>api.save.unlocked,centered=stage===api.getCentered();
    button.dataset.stage=String(stage);button.setAttribute("aria-posinset",String(stage));button.setAttribute("aria-setsize",String(TOTAL));button.setAttribute("aria-disabled",String(locked));
    button.classList.toggle("locked",locked);button.classList.toggle("centered",centered);button.setAttribute("aria-current",centered?"true":"false");button.tabIndex=centered?0:-1;
    button.querySelector("small").textContent=api.chapters[api.chapterFor(stage)];button.querySelector("strong").textContent=`Stage ${stage}`;button.querySelector("span").textContent=status(stage,api.save);
  }
  function sync(){cards.forEach(card=>bind(card,Number(card.dataset.stage)))}
  function moveWindow(next){
    const rail=api.rail,target=clamp(next,1,TOTAL-POOL+1);let recycled=0;
    while(windowStart<target){const card=rail.firstElementChild,anchor=card?.nextElementSibling,before=anchor?.getBoundingClientRect().left;windowStart++;rail.append(card);bind(card,windowStart+POOL-1);const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before;recycled++}
    while(windowStart>target){const card=rail.lastElementChild,anchor=card?.previousElementSibling,before=anchor?.getBoundingClientRect().left;windowStart--;rail.prepend(card);bind(card,windowStart);const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before;recycled++}
    cards=[...rail.children];rail.dataset.wpStageWindowStart=String(windowStart);rail.dataset.wpStageWindowEnd=String(windowStart+POOL-1);if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);return recycled;
  }
  function geometry(){const rail=api.rail,first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),box=rail.getBoundingClientRect(),delta=first&&second?(second.left+second.width/2)-(first.left+first.width/2):0;return{rail,center:box.left+box.width/2,pitch:Math.abs(delta)||(first?.width||220)+12,orientation:Math.sign(delta)||1}}
  function nearest(){const center=geometry().center;return cards.reduce((best,card)=>{const box=card.getBoundingClientRect(),distance=Math.abs(box.left+box.width/2-center);return!best||distance<best.distance?{card,distance}:best},null)?.card}
  function logical(){const card=nearest();if(!card)return api.getCentered();const stage=Number(card.dataset.stage),box=card.getBoundingClientRect(),g=geometry();return clamp(stage+(g.center-(box.left+box.width/2))/(g.pitch*g.orientation))}
  function position(value){const logicalStage=clamp(value),anchor=Math.round(logicalStage);if(moveWindow(desired(anchor)))sync();const card=api.rail.querySelector(`[data-stage="${anchor}"]`);if(!card)return logicalStage;card.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"});const g=geometry(),fraction=logicalStage-anchor;if(Math.abs(fraction)>.0001)g.rail.scrollLeft+=fraction*g.orientation*g.pitch;g.rail.dataset.wpStageDragLogical=logicalStage.toFixed(4);return logicalStage}
  function select(stage,smooth=false){stage=clamp(stage);api.setCentered(stage);moveWindow(desired(stage));sync();const card=api.rail.querySelector(`[data-stage="${stage}"]`);card?.scrollIntoView({behavior:smooth?"smooth":"auto",block:"nearest",inline:"center"});card?.focus({preventScroll:true})}
  function installDrag(){
    const rail=api.rail;if(rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";rail.dataset.wpStageSettleDuration="340";
    let pointerId=null,startX=0,lastX=0,dragLogical=1,moved=false,suppressClick=false;
    rail.addEventListener("pointerdown",event=>{if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(settleRaf);pointerId=event.pointerId;startX=lastX=event.clientX;dragLogical=logical();moved=false;rail.setPointerCapture?.(pointerId);rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");event.stopImmediatePropagation()},true);
    rail.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4)moved=true;if(moved){if(event.cancelable)event.preventDefault();const box=rail.getBoundingClientRect(),scale=box.width?rail.clientWidth/box.width:1;dragLogical=position(dragLogical-delta*scale/geometry().pitch)}event.stopImmediatePropagation()},true);
    const finish=event=>{if(pointerId===null||event.pointerId!==pointerId)return;rail.releasePointerCapture?.(pointerId);pointerId=null;if(moved){if(event.cancelable)event.preventDefault();const from=dragLogical,target=clamp(Math.round(from)),start=performance.now();api.setCentered(target);rail.dataset.wpStageSettling="true";const settle=now=>{const progress=clamp((now-start)/340,0,1),eased=progress*progress*(3-2*progress);position(from+(target-from)*eased);if(progress<1)settleRaf=requestAnimationFrame(settle);else{position(target);sync();delete rail.dataset.wpStageSettling;rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type")}};settleRaf=requestAnimationFrame(settle);suppressClick=true;setTimeout(()=>{suppressClick=false},0)}else{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type")}moved=false;event.stopImmediatePropagation()};
    rail.addEventListener("pointerup",finish,true);rail.addEventListener("pointercancel",finish,true);
    rail.addEventListener("click",event=>{const card=event.target.closest?.(".stage-card")||document.elementFromPoint(event.clientX,event.clientY)?.closest?.(".stage-card"),stage=Number(card?.dataset.stage);if(!stage)return;event.preventDefault();event.stopImmediatePropagation();if(suppressClick){suppressClick=false;return}if(stage!==api.getCentered()){select(stage,true);return}if(stage>api.save.unlocked){api.announce("Complete the previous stage first.");return}api.enter(stage)},true);
    rail.addEventListener("keydown",event=>{const rtl=getComputedStyle(rail).direction==="rtl",step=event.key==="ArrowRight"?(rtl?-1:1):event.key==="ArrowLeft"?(rtl?1:-1):0;const target=step?api.getCentered()+step:event.key==="Home"?1:event.key==="End"?TOTAL:0;if(target){event.preventDefault();event.stopImmediatePropagation();select(target,true)}else if((event.key==="Enter"||event.key===" ")&&api.getCentered()>api.save.unlocked){event.preventDefault();api.announce("Complete the previous stage first.")}},true);
  }
  window.BlockTrilogyStageRenderer={render(nextApi){api=nextApi;const rail=api.rail;if(!cards.length||cards.some(card=>card.parentElement!==rail)){rail.replaceChildren();cards=Array.from({length:POOL},createCard);cards.forEach(card=>rail.append(card));windowStart=desired(api.getCentered());cards.forEach((card,index)=>bind(card,windowStart+index));Object.assign(rail.dataset,{wpStageVirtualized:"bounded-recycle",wpStagePoolSize:String(POOL),wpStageTotal:String(TOTAL),wpStageRecycleCount:"0"});installDrag()}select(api.getCentered());return true}};
})();
