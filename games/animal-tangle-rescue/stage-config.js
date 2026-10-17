/* Authored Stage records for the shared Interface 9 Play UI. */
(() => {
  'use strict';
  const scriptUrl = document.currentScript?.src || document.baseURI;
  const poster = new URL('assets/animal-tangle-rescue-cover.webp', scriptUrl).href;
  window.TangleRescueStageConfig = Object.freeze({
    gameId: 'animal-tangle-rescue',
    get count() { return window.AnimalTangleRescueI9?.stageCount || 30; },
    poster,
    background: poster,
    stage(index) {
      const record = window.AnimalTangleRescueI9?.stageRecord(index);
      if (!record) throw new RangeError(`Unknown Tangle Rescue stage: ${index}`);
      return {
        id: record.id,
        kicker: record.kicker,
        title: record.title,
        subtitle: record.hint,
        status: record.status,
        summary: record.summary,
        details: [record.hint],
        poster,
        locked: record.locked,
        cleared: record.cleared,
      };
    },
  });
})();
