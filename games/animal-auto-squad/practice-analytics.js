// Disable shared analytics before its loader runs for an isolated localhost
// practice request, including while authentication is pending or rejected.
// Authorization is owned exclusively by the shared LocalPractice adapter.
(function () {
  if (location.protocol !== 'http:' || !['localhost','127.0.0.1','[::1]'].includes(location.hostname) || new URLSearchParams(location.search).get('practice') !== '1') return;
  const config = window.WONDER_SITE?.analytics;
  if (!config) return;
  config.enabled = false;
  if (config.gaMeasurementId) window[`ga-disable-${config.gaMeasurementId}`] = true;
}());
