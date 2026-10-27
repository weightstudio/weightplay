// Disable the local collector before it starts on requested localhost practice.
(() => {
  if (location.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || new URLSearchParams(location.search).get('practice') !== '1') return;
  const analytics = window.WONDER_SITE?.analytics;
  if (!analytics) return;
  analytics.enabled = false;
  if (analytics.gaMeasurementId) window[`ga-disable-${analytics.gaMeasurementId}`] = true;
})();
