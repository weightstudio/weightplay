// Local practice is isolated from its first request, even before auth. The
// shared bootstrap loads site-config asynchronously on this particular entry.
(() => {
  if (location.protocol !== 'http:' || !['localhost','127.0.0.1','[::1]'].includes(location.hostname) || new URLSearchParams(location.search).get('practice') !== '1') return;
  const disable = site => {
    if (!site?.analytics || typeof site.analytics !== 'object') throw Error('PRACTICE_ANALYTICS_CONFIG_INVALID');
    site.analytics.enabled = false;
    if (site.analytics.gaMeasurementId) window[`ga-disable-${site.analytics.gaMeasurementId}`] = true;
    return site;
  };
  try {
    const descriptor=Object.getOwnPropertyDescriptor(window,'WONDER_SITE');
    if (descriptor && !descriptor.configurable) throw Error('PRACTICE_ANALYTICS_GUARD_UNAVAILABLE');
    let current = window.WONDER_SITE ? disable(window.WONDER_SITE) : undefined;
    // Bootstrap and the authored entry may both load site-config. Keep the
    // interceptor for the whole page so a later assignment cannot re-enable it.
    Object.defineProperty(window,'WONDER_SITE',{configurable:true,enumerable:true,get(){return current},set(value){
      try { current=disable(value); }
      catch { window.__cozyPracticeAnalyticsSafe=false; current={analytics:{enabled:false}}; }
    }});
    window.__cozyPracticeAnalyticsSafe=true;
  } catch { window.__cozyPracticeAnalyticsSafe=false; }
})();
