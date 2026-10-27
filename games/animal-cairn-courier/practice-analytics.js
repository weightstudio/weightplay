// Keep the shared collector disabled from the first config assignment in local practice.
(() => {
  if(location.protocol!=='http:'||!['localhost','127.0.0.1','[::1]'].includes(location.hostname)||new URLSearchParams(location.search).get('practice')!=='1')return;
  const disable=site=>{if(!site?.analytics||typeof site.analytics!=='object')throw Error('PRACTICE_ANALYTICS_CONFIG_INVALID');site.analytics.enabled=false;if(site.analytics.gaMeasurementId)window[`ga-disable-${site.analytics.gaMeasurementId}`]=true;return site;};
  try{
    const descriptor=Object.getOwnPropertyDescriptor(window,'WONDER_SITE');if(descriptor&&!descriptor.configurable)throw Error('PRACTICE_ANALYTICS_GUARD_UNAVAILABLE');
    let current=window.WONDER_SITE?disable(window.WONDER_SITE):undefined;
    Object.defineProperty(window,'WONDER_SITE',{configurable:true,enumerable:true,get(){return current;},set(value){try{current=disable(value);}catch{window.__cairnPracticeAnalyticsSafe=false;current={analytics:{enabled:false}};}}});
    window.__cairnPracticeAnalyticsSafe=true;
  }catch{window.__cairnPracticeAnalyticsSafe=false;}
})();
