// Disable the collector before it starts on localhost practice pages.
(function(){
 if(location.protocol!=='http:'||!['localhost','127.0.0.1','[::1]'].includes(location.hostname)||new URLSearchParams(location.search).get('practice')!=='1')return;
 const config=window.WONDER_SITE?.analytics;if(!config)return;config.enabled=false;
 if(config.gaMeasurementId)window[`ga-disable-${config.gaMeasurementId}`]=true;
}());
