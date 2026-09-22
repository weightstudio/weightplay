/* Deprecated URL bridge. Current routes load weightplay-audio.js directly. */
(function () {
  if (window.WeightPlayAudio) return;
  const next = new URL('weightplay-audio.js?v=1.0.0', document.currentScript?.src || document.baseURI);
  if (document.querySelector('script[data-weightplay-audio-bridge]')) return;
  const script = document.createElement('script');
  script.src = next.href;
  script.dataset.weightplayAudioBridge = 'true';
  document.head.append(script);
})();
