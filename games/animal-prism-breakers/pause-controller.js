(() => {
  "use strict";

  const copies={
    en:{pause:"Pause",paused:"Paused",message:"The crystal formation is frozen until you resume.",resume:"Resume"},
    "zh-Hant":{pause:"暫停",paused:"已暫停",message:"水晶陣列已停止，直到你繼續遊戲。",resume:"繼續"},
    "zh-Hans":{pause:"暂停",paused:"已暂停",message:"水晶阵列已停止，直到你继续游戏。",resume:"继续"},
    ja:{pause:"一時停止",paused:"一時停止中",message:"再開するまで水晶陣形は停止しています。",resume:"再開"},
    ko:{pause:"일시정지",paused:"일시정지됨",message:"다시 시작할 때까지 수정 진형이 멈춥니다.",resume:"계속"},
    es:{pause:"Pausa",paused:"En pausa",message:"La formación de cristales queda detenida hasta que continúes.",resume:"Continuar"},
    "pt-BR":{pause:"Pausar",paused:"Pausado",message:"A formação de cristais fica parada até você continuar.",resume:"Continuar"},
    fr:{pause:"Pause",paused:"En pause",message:"La formation de cristaux reste figée jusqu’à la reprise.",resume:"Reprendre"},
    de:{pause:"Pause",paused:"Pausiert",message:"Die Kristallformation bleibt bis zum Fortsetzen eingefroren.",resume:"Fortsetzen"},
    it:{pause:"Pausa",paused:"In pausa",message:"La formazione di cristalli resta ferma finché non riprendi.",resume:"Riprendi"},
    ru:{pause:"Пауза",paused:"Игра приостановлена",message:"Кристальная формация неподвижна до продолжения игры.",resume:"Продолжить"},
    hi:{pause:"रोकें",paused:"खेल रुका है",message:"दोबारा शुरू करने तक क्रिस्टल संरचना स्थिर रहेगी।",resume:"जारी रखें"},
    ar:{pause:"إيقاف مؤقت",paused:"اللعبة متوقفة",message:"يبقى تشكيل البلورات ثابتًا حتى تتابع اللعب.",resume:"متابعة"}
  };
  const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||"en",copy=copies[locale]||copies.en;
  const battleCanvas=document.querySelector(".battle-canvas"),help=document.querySelector("#helpModal"),helpButton=document.querySelector("#battleHelp"),helpClose=document.querySelector("#helpClose");
  const pause=document.createElement("section");pause.id="pauseModal";pause.className="modal";pause.hidden=true;pause.setAttribute("role","dialog");pause.setAttribute("aria-modal","true");pause.setAttribute("aria-labelledby","pauseTitle");pause.innerHTML=`<div class="dialog"><h2 id="pauseTitle"></h2><p id="pauseText"></p><div class="modal-actions" style="grid-template-columns:minmax(160px,260px);justify-content:center"><button id="pauseResume" class="primary" type="button"></button></div></div>`;battleCanvas.append(pause);
  pause.querySelector("#pauseTitle").textContent=copy.paused;pause.querySelector("#pauseText").textContent=copy.message;const resume=pause.querySelector("#pauseResume");resume.textContent=copy.resume;resume.setAttribute("aria-label",copy.resume);
  function addButton(){
    const controls=document.querySelector("#battleControls"),restart=controls?.querySelector("#breakerRestart");if(!restart||controls.querySelector("#breakerPause"))return;
    const button=document.createElement("button");button.id="breakerPause";button.type="button";button.textContent=copy.pause;button.style.textTransform="capitalize";button.setAttribute("aria-label",copy.pause);button.addEventListener("click",openPause);restart.after(button);
  }
  function openPause(){
    if(document.body.dataset.screen!=="battle"||!pause.hidden||!document.querySelector("#resultModal")?.hidden)return;
    helpButton.click();help.hidden=true;pause.hidden=false;resume.focus();
  }
  function closePause(){
    if(pause.hidden)return;pause.hidden=true;helpClose.click();setTimeout(()=>document.querySelector("#breakerPause")?.focus(),0);
  }
  resume.addEventListener("click",closePause);document.addEventListener("keydown",event=>{if(!pause.hidden&&event.key==="Escape"){event.preventDefault();closePause()}},true);
  new MutationObserver(addButton).observe(document.querySelector("#battleControls"),{childList:true,subtree:true});addButton();
})();
