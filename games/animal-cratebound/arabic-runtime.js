(()=>{
  "use strict";

  const exact={
    "Opening the cargo ark…":"جارٍ فتح سفينة الشحن…","Back to WeightPlay":"العودة إلى WeightPlay","Animal Cratebound":"صناديق الحيوانات","Rux pushing rune cargo through a sky ark":"روكس يدفع صناديق رونية عبر سفينة سماوية","Cargo logic adventure":"مغامرة منطق الشحن","Walk, push, pull and route every rune crate onto its matching dock.":"تحرّك وادفع واسحب، ثم وجّه كل صندوق روني إلى رصيفه المطابق.","Start Game":"ابدأ اللعبة","Original WeightPlay block puzzle":"لغز صناديق أصلي من WeightPlay","Plan the warehouse before the first push.":"خطّط للمستودع قبل الدفعة الأولى.","Every crate and device is deterministic. Read the route, preserve turning room, and use magnetic pulls only when they recover a stranded cargo block.":"لكل صندوق وجهاز سلوك ثابت. اقرأ المسار، واترك مساحة للدوران، ولا تستخدم السحب المغناطيسي إلا لإنقاذ صندوق عالق.","How to play":"كيف تلعب","Como jogar":"كيف تلعب","Move one square with arrows, WASD, swipe or the direction pad.":"تحرّك مربعًا واحدًا بالأسهم أو WASD أو السحب أو لوحة الاتجاهات.","Push cargo into open cells and match every glowing dock.":"ادفع الشحنات إلى الخلايا المفتوحة وطابق كل رصيف متوهج.","Hold Shift or choose Pull to spend a magnetic charge.":"اضغط مفتاح التبديل أو اختر سحب لاستهلاك شحنة مغناطيسية.","Thirty warehouses":"ثلاثون مستودعًا","Six chapters introduce ice rails, signal gates, magnets, linked crates and one-way belts.":"تقدّم ستة فصول قضبان جليدية وبوابات إشارات ومغناطيسًا وصناديق مترابطة وأحزمة أحادية الاتجاه.","Choose a Warehouse":"اختر مستودعًا","Back":"رجوع","Warehouse selector":"محدد المستودعات","Drag the rail. The centred glowing card is selected.":"اسحب المسار. البطاقة المتوهجة في الوسط هي المحددة.","First Freight":"الشحنة الأولى","Polar Rails":"القضبان الجليدية","Signal Deck":"سطح الإشارات","Magnet Bay":"خليج المغناطيس","Twin Cargo":"الشحنة المزدوجة","Storm Ark":"سفينة العاصفة","Locked":"مقفلة","Ready":"جاهزة","Cleared · Replay":"اكتملت · إعادة اللعب","Moves":"الحركات","Docked":"الراسية","Pulls":"السحبات","Dock every rune crate without trapping it.":"أرسِ كل صندوق روني من دون أن تحاصره.","Cargo warehouse board":"لوحة مستودع الشحن","Move beside cargo to push it. Pull moves you backward while drawing the adjacent crate into your previous cell.":"تحرّك بجوار الصندوق لدفعه. السحب يعيدك إلى الخلف ويجذب الصندوق المجاور إلى خليتك السابقة.","Continue":"متابعة","Leave this route?":"مغادرة هذا المسار؟","Your completed progress is safe. This attempt will restart.":"تقدمك المكتمل محفوظ. ستُعاد هذه المحاولة.","Stage Map":"خريطة المراحل","Stage Complete":"اكتملت المرحلة","Every cargo block reached its dock.":"وصلت كل صناديق الشحن إلى أرصفتها.","Status":"الحالة","Retry":"إعادة المحاولة","Next Stage":"المرحلة التالية","Undo":"تراجع","Restart":"إعادة البدء","Cargo docked":"تم إرساء الشحنة","No magnetic pull charge remains.":"لم تتبقَّ شحنة سحب مغناطيسي.","Stand beside a crate with clear space behind you.":"قف بجوار صندوق واترك مساحة خالية خلفك.","Magnetic pull used.":"استُخدم السحب المغناطيسي.","That cargo path is blocked.":"مسار الشحنة مسدود.","Linked cargo moved together.":"تحركت الشحنات المترابطة معًا.","That route is blocked.":"هذا المسار مسدود.","Signal gate opened.":"فُتحت بوابة الإشارة.","The storm belt carried Rux forward.":"حمل حزام العاصفة روكس إلى الأمام.","Nothing to undo.":"لا توجد حركة للتراجع.","Move undone.":"تم التراجع عن الحركة.","Complete the previous stage first.":"أكمل المرحلة السابقة أولًا."
  };
  const chapters=["الشحنة الأولى","القضبان الجليدية","سطح الإشارات","خليج المغناطيس","الشحنة المزدوجة","سفينة العاصفة"];
  let active=false,timer=0;
  const setText=(node,value)=>{if(node&&value!==undefined&&node.textContent!==value)node.textContent=value};

  const translateValue=value=>{
    if(typeof value!=="string"||!value.trim())return value;
    const leading=value.match(/^\s*/u)?.[0]||"",trailing=value.match(/\s*$/u)?.[0]||"";
    let core=value.slice(leading.length,value.length-trailing.length||undefined);
    const pt=window.WeightPlayGameRuntimeLocales?.["pt-BR"]||{};
    if(!translateValue.reverse){translateValue.reverse=new Map(Object.entries(pt).map(([source,translated])=>[translated,source]))}
    core=translateValue.reverse.get(core)||core;
    const mixedLocaleExact={"Estágio Map":exact["Stage Map"],"Próximo Stage":exact["Next Stage"]};
    let translated=exact[core]||mixedLocaleExact[core];
    if(!translated){
      let match=core.match(/^(?:Stage|Estágio)\s+(\d+)$/u);if(match)translated=`المرحلة ${match[1]}`;
      match ||= core.match(/^(\d+)\s+(?:moves|movimentos)$/u);if(match&&/moves|movimentos/u.test(core))translated=`${match[1]} حركات`;
      match=core.match(/^(\d+)\s+(?:pulls|puxa|puxões)$/u);if(match)translated=`${match[1]} سحبات`;
      match=core.match(/^(?:Pull|Puxe|Puxar)\s+(\d+)$/u);if(match)translated=`سحب ${match[1]}`;
    }
    return `${leading}${translated||core}${trailing}`;
  };
  const translateNode=node=>{
    if(node.nodeType===Node.TEXT_NODE){if(!["SCRIPT","STYLE","NOSCRIPT","OPTION"].includes(node.parentElement?.tagName||"")){const next=translateValue(node.data);if(next!==node.data)node.data=next}return}
    if(!(node instanceof Element))return;
    for(const name of ["aria-label","aria-description","title","placeholder","alt"]){if(!node.hasAttribute(name))continue;const value=node.getAttribute(name)||"",next=translateValue(value);if(next!==value)node.setAttribute(name,next)}
  };
  const translateTree=root=>{translateNode(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode)};
  const applyOwnedState=(full=false)=>{
    const C=window.BlockTrilogyConfig,state=window.__blockTrilogyTest?.getState?.();
    document.documentElement.lang="ar";document.documentElement.dir="rtl";
    document.querySelectorAll('[data-game-title]').forEach(node=>setText(node,exact["Animal Cratebound"]));
    setText(document.querySelector(".hero-copy>small"),exact["Cargo logic adventure"]);setText(document.querySelector(".guide>small"),exact["Original WeightPlay block puzzle"]);const guideHeadings=document.querySelectorAll(".guide h3");setText(guideHeadings[0],exact["How to play"]);setText(guideHeadings[1],exact["Thirty warehouses"]);
    setText(document.querySelector(".stage-header strong"),exact["Choose a Warehouse"]);setText(document.getElementById("stageHint"),exact["Drag the rail. The centred glowing card is selected."]);document.getElementById("stageRail")?.setAttribute("aria-label",exact["Warehouse selector"]);
    const fixed={pitch:exact["Walk, push, pull and route every rune crate onto its matching dock."],start:exact["Start Game"],guideTitle:exact["Plan the warehouse before the first push."],guideIntro:exact["Every crate and device is deterministic. Read the route, preserve turning room, and use magnetic pulls only when they recover a stranded cargo block."],growth:exact["Six chapters introduce ice rails, signal gates, magnets, linked crates and one-way belts."],objective:exact["Dock every rune crate without trapping it."],helpText:exact["Move beside cargo to push it. Pull moves you backward while drawing the adjacent crate into your previous cell."]};
    for(const [id,value] of Object.entries(fixed))setText(document.getElementById(id),value);
    const how=document.getElementById("howList"),howItems=[exact["Move one square with arrows, WASD, swipe or the direction pad."],exact["Push cargo into open cells and match every glowing dock."],exact["Hold Shift or choose Pull to spend a magnetic charge."]],howHtml=howItems.map(item=>`<li>${item}</li>`).join("");if(how&&how.innerHTML!==howHtml)how.innerHTML=howHtml;
    if(state?.screen==="stage")document.querySelectorAll(".stage-card").forEach(card=>{const stage=Number(card.dataset.stage),chapter=Math.min(5,Math.floor((stage-1)/5)),save=JSON.parse(localStorage.getItem("animal-crateboundSaveV1")||"{}");setText(card.querySelector("small"),chapters[chapter]);setText(card.querySelector("strong"),`المرحلة ${stage}`);setText(card.querySelector("span"),card.classList.contains("locked")?"مقفلة":save.cleared?.[stage]?"اكتملت · إعادة اللعب":"جاهزة")});
    if(state?.screen==="battle"){const chapter=Math.min(5,Math.floor((state.selected-1)/5));setText(document.getElementById("stageLabel"),`المرحلة ${state.selected}`);setText(document.getElementById("goalValue"),chapters[chapter])}
    if(full)translateTree(document.body);else for(const root of [document.querySelector(".battle-header"),document.getElementById("battleControls"),document.getElementById("feedback"),document.getElementById("resultModal")])if(root)translateTree(root);
    const resultModal=document.getElementById("resultModal"),resultTitle=document.getElementById("resultTitle");
    if(resultModal&&!resultModal.hidden&&resultTitle&&/(?:Complete|المرحلة)/u.test(resultTitle.textContent.trim()))setText(resultTitle,exact["Stage Complete"]);
  };
  const activate=()=>{
    if(active){applyOwnedState(true);return}active=true;applyOwnedState(true);
    timer=window.setInterval(()=>applyOwnedState(false),100);
  };
  document.getElementById("localeSelect")?.addEventListener("change",event=>{if(event.currentTarget.value!=="ar")return;event.stopImmediatePropagation();try{localStorage.setItem("weightPlayLocale","ar")}catch{}window.WonderI18n?.setLocale?.("ar");activate()},{capture:true});
  if((window.WonderI18n?.actualLocale?.()||document.documentElement.lang)==="ar")activate();
})();
