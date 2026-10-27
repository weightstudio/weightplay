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
    const style=document.createElement('style');style.textContent='@media (orientation:portrait){body[data-wp-game-id="animal-coloring-studio"] [data-wp-local-practice]{top:56px!important}} @media (orientation:portrait) and (max-width:360px){body[data-wp-game-id="animal-coloring-studio"] :is(.palette,.tools)::before{content:"⇆";flex:0 0 22px;align-self:center;color:#fff0bb;font:bold 19px/1 system-ui;text-align:center}}';document.head.append(style);
    window.__coloringPracticeSafe=true;
  } catch { window.__coloringPracticeSafe=false; }
})();
