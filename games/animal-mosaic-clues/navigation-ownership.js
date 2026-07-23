(()=>{
  "use strict";

  const body=document.body;
  const mainReturn=document.querySelector(".lobby-return");
  if(mainReturn)mainReturn.dataset.wpReturn="main";

  let previous=body.dataset.screen||"main";
  const focusScreen=(screen)=>{
    const target=screen==="main"
      ?document.querySelector("#start")
      :screen==="stage"
        ?document.querySelector(".stage-card.centered")
        :screen==="battle"
          ?document.querySelector("#battleBack")
          :null;
    if(target&&!target.closest("[hidden]"))target.focus({preventScroll:true});
  };

  new MutationObserver(()=>{
    const current=body.dataset.screen||"main";
    if(current===previous)return;
    previous=current;
    requestAnimationFrame(()=>requestAnimationFrame(()=>focusScreen(current)));
  }).observe(body,{attributes:true,attributeFilter:["data-screen"]});
})();
