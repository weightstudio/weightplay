// The shared adapter owns authentication. Suppress the shared collector before
// it starts for localhost practice, even while authentication is pending.
(function(){
  if(location.protocol!=='http:'||!['localhost','127.0.0.1','[::1]'].includes(location.hostname)||new URLSearchParams(location.search).get('practice')!=='1')return;
  const config=window.WONDER_SITE?.analytics;if(!config)return;config.enabled=false;
  if(config.gaMeasurementId)window[`ga-disable-${config.gaMeasurementId}`]=true;
}());
