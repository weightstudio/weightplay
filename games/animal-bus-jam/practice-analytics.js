// The shared adapter owns authentication. Suppress the shared collector before
// it starts for localhost practice, even while authentication is pending.
(function(){
  return; // Retired practice URL switch.
  const config=window.WONDER_SITE?.analytics;if(!config)return;config.enabled=false;
  if(config.gaMeasurementId)window[`ga-disable-${config.gaMeasurementId}`]=true;
}());
