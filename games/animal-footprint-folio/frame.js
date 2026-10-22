(() => {
  'use strict';
  const $=id=>document.getElementById(id), runtime=window.WeightPlayScreenFrame;
  const frame=runtime.mount({root:$('app'),localeSelect:$('locale'),playUI:true,scenes:{
    main:{root:$('mainScreen'),header:document.querySelector('#mainScreen header'),content:document.querySelector('.main-grid')},
    stage:{root:$('stageScreen'),header:document.querySelector('#stageScreen header'),content:$('stageContent')},
    battle:{root:$('battleScreen'),header:document.querySelector('#battleScreen header'),content:$('battleContent'),headerInfo:$('battleInfo')},
  }});
  const info=runtime.createGroup();info.add($('recordCount')).add($('masteryCount'));frame.battleTopUI.add(info);
  frame.activate('main');window.__ANIMAL_FOOTPRINT_FOLIO_FRAME__=frame;
  window.addEventListener('pagehide',e=>{if(!e.persisted)frame.destroy();});
})();
