(() => {
  "use strict";
  const GAME_ID = "animal-field-dossier";
  const GAME_VERSION = "v1";
  const queue = window.wpAnalyticsQueue = window.wpAnalyticsQueue || [];
  window.wpTrack = (eventName, details = {}) => {
    queue.push({ gameId: GAME_ID, gameVersion: GAME_VERSION, eventName, details, at: Date.now() });
  };
})();
