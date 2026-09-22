(()=>{
  'use strict';
  const labels={
    en:'Stages','zh-Hant':'關卡','zh-Hans':'关卡',ja:'ステージ',ko:'스테이지',
    es:'Niveles','pt-BR':'Fases',fr:'Niveaux',de:'Level',it:'Livelli',
    ru:'Уровни',hi:'स्तर',ar:'المراحل',
  };
  function locale(){
    const raw=window.WonderI18n?.actualLocale?.()||window.WonderI18n?.locale?.()||document.documentElement.lang||'en';
    if(/^zh-(tw|hant)/i.test(raw))return 'zh-Hant';
    if(/^zh/i.test(raw))return 'zh-Hans';
    if(/^pt/i.test(raw))return 'pt-BR';
    return labels[raw]?raw:raw.split('-')[0];
  }
  function apply(){
    const node=document.querySelector('[data-wp-stage-tab-label]');
    if(!node)return;
    node.textContent=labels[locale()]||labels.en;
  }
  window.addEventListener('wonder:locale-change',()=>queueMicrotask(apply));
  window.addEventListener('weightplay:shell-sync',()=>queueMicrotask(apply));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
