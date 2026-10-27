// Local-only, early collector guard candidate. Not yet included by the entry.
(() => {
  'use strict';
  const local=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  if(!local||new URLSearchParams(location.search).get('practice')!=='1')return;
  window.__CrystalPracticeRequested=true;
  try{
    const analytics=window.WONDER_SITE?.analytics;
    if(!analytics)throw Error('ANALYTICS_CONFIG_UNAVAILABLE');
    analytics.enabled=false;
    if(analytics.enabled!==false)throw Error('ANALYTICS_DISABLE_UNCONFIRMED');
    if(analytics.gaMeasurementId)window[`ga-disable-${analytics.gaMeasurementId}`]=true;
    window.__CrystalPracticeGuardReady=true;
  }catch{window.__CrystalPracticeGuardReady=false}
})();
