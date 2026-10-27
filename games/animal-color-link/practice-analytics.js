// Keep the shared collector disabled from the first config assignment in local practice.
(() => {
  if(location.protocol!=='http:'||!['localhost','127.0.0.1','[::1]'].includes(location.hostname)||new URLSearchParams(location.search).get('practice')!=='1')return;
  const disable=site=>{if(!site?.analytics||typeof site.analytics!=='object')throw Error('PRACTICE_ANALYTICS_CONFIG_INVALID');site.analytics.enabled=false;if(site.analytics.gaMeasurementId)window[`ga-disable-${site.analytics.gaMeasurementId}`]=true;return site;};
  try{
    // The shared body tutorial persists its seen flag. Keep this game's flag
    // in memory during local practice so closing it cannot change player data.
    const storage=window.localStorage,proto=Object.getPrototypeOf(storage),get=proto.getItem,set=proto.setItem;
    const tutorialKey='weightplay_tutorial_seen_animal-color-link_v1';let practiceTutorialSeen;
    if(typeof get!=='function'||typeof set!=='function')throw Error('PRACTICE_STORAGE_GUARD_UNAVAILABLE');
    Object.defineProperty(proto,'getItem',{...Object.getOwnPropertyDescriptor(proto,'getItem'),value:function(key){return this===storage&&String(key)===tutorialKey&&practiceTutorialSeen!==undefined?practiceTutorialSeen:get.call(this,key)}});
    Object.defineProperty(proto,'setItem',{...Object.getOwnPropertyDescriptor(proto,'setItem'),value:function(key,value){if(this===storage&&String(key)===tutorialKey){practiceTutorialSeen=String(value);return}return set.call(this,key,value)}});
    const descriptor=Object.getOwnPropertyDescriptor(window,'WONDER_SITE');if(descriptor&&!descriptor.configurable)throw Error('PRACTICE_ANALYTICS_GUARD_UNAVAILABLE');
    let current=window.WONDER_SITE?disable(window.WONDER_SITE):undefined;
    Object.defineProperty(window,'WONDER_SITE',{configurable:true,enumerable:true,get(){return current;},set(value){try{current=disable(value);}catch{window.__colorLinkPracticeAnalyticsSafe=false;current={analytics:{enabled:false}};}}});
    window.__colorLinkPracticeAnalyticsSafe=true;
  }catch{window.__colorLinkPracticeAnalyticsSafe=false;}
})();
