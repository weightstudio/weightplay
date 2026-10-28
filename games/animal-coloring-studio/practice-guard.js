// Local-only practice must be isolated even before authorization is granted.
(() => {
  if(location.protocol!=='http:'||!['localhost','127.0.0.1','[::1]'].includes(location.hostname)||new URLSearchParams(location.search).get('practice')!=='1')return;
  try {
    const local=window.localStorage,session=window.sessionStorage,proto=Object.getPrototypeOf(local);
    for(const name of ['setItem','removeItem','clear']){
      const descriptor=Object.getOwnPropertyDescriptor(proto,name);if(!descriptor?.configurable||typeof descriptor.value!=='function')throw Error('STORAGE_GUARD_UNAVAILABLE');
      const original=descriptor.value;
      Object.defineProperty(proto,name,{...descriptor,value:function(...args){if(this===local||this===session)return undefined;return Reflect.apply(original,this,args)}});
    }
    const disable=site=>{if(!site?.analytics||typeof site.analytics!=='object')throw Error('ANALYTICS_CONFIG_INVALID');site.analytics.enabled=false;if(site.analytics.gaMeasurementId)window[`ga-disable-${site.analytics.gaMeasurementId}`]=true;return site};
    const descriptor=Object.getOwnPropertyDescriptor(window,'WONDER_SITE');if(descriptor&&!descriptor.configurable)throw Error('ANALYTICS_GUARD_UNAVAILABLE');
    let current=window.WONDER_SITE?disable(window.WONDER_SITE):undefined;
    Object.defineProperty(window,'WONDER_SITE',{configurable:true,enumerable:true,get(){return current},set(value){try{current=disable(value)}catch{window.__coloringPracticeSafe=false;current={analytics:{enabled:false}}}}});
    const style=document.createElement('style');style.textContent='[data-practice-tools-wrap="true"]{display:contents}.coloring-practice-tools-cue{display:none}@media (orientation:portrait){body[data-wp-game-id="animal-coloring-studio"] [data-wp-local-practice]{top:56px!important}body[data-wp-game-id="animal-coloring-studio"][data-coloring-v25="true"] [data-practice-tools-wrap="true"]{display:flex;align-items:stretch;width:100%;min-width:0}body[data-wp-game-id="animal-coloring-studio"][data-coloring-v25="true"] .coloring-practice-tools-cue{display:grid;place-items:center;flex:0 0 22px;color:#fff0bb;font:bold 19px/1 system-ui;text-align:center}body[data-wp-game-id="animal-coloring-studio"][data-coloring-v25="true"] [data-practice-tools-wrap="true"]>.tools{flex:1 1 0;width:0;min-width:0}} @media (orientation:portrait) and (max-width:360px){body[data-wp-game-id="animal-coloring-studio"] .palette::before{content:"⇆";flex:0 0 22px;align-self:center;color:#fff0bb;font:bold 19px/1 system-ui;text-align:center}}';document.head.append(style);
    style.textContent+=' .coloring-practice-areas{box-sizing:border-box;width:min(560px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto;border:2px solid #f6d47b;border-radius:12px;background:#102c3a;color:#fff;padding:12px;font:16px/1.2 system-ui}.coloring-practice-areas::backdrop{background:#00101bc9}.coloring-practice-areas h2{margin:0 0 8px;font-size:18px}.coloring-practice-areas .area-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}.coloring-practice-areas button{min-height:48px;min-width:48px;border:2px solid #b8d6d9;border-radius:8px;background:#234a58;color:white;font:600 14px/1.2 system-ui;cursor:pointer}.coloring-practice-areas .area-choice{display:flex;align-items:center;gap:6px;text-align:start;padding:5px}.coloring-practice-areas .area-choice span{min-width:0;overflow-wrap:anywhere}.coloring-practice-areas canvas{width:48px;height:72px;flex:none;background:#fff;border-radius:3px}.coloring-practice-areas .area-close{margin:0 0 10px;padding:6px 14px}.coloring-practice-areas button:focus-visible{outline:3px solid #ffe182;outline-offset:2px}';
    window.__coloringPracticeSafe=true;
  } catch { window.__coloringPracticeSafe=false; }
})();
