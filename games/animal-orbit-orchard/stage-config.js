(() => {
  'use strict';

  const POSTER = '/assets/interface7-redrawn/animal-orbit-orchard.webp';
  const BACKGROUND = '/assets/lobby-block-atmosphere.svg';

  function create({ rounds, getCampaign, localize, arcName, isPractice = () => false }) {
    if (!Array.isArray(rounds) || typeof getCampaign !== 'function'
      || typeof localize !== 'function' || typeof arcName !== 'function') {
      throw new TypeError('ORBIT_ORCHARD_STAGE_CONFIG_REQUIRED');
    }

    return Object.freeze({
      gameId: 'animal-orbit-orchard',
      count: rounds.length,
      poster: POSTER,
      background: BACKGROUND,
      stage(index) {
        const stage = rounds[index];
        if (!stage) throw new RangeError(`ORBIT_ORCHARD_STAGE_INDEX:${index}`);
        const campaign = getCampaign();
        const cleared = campaign.cleared.includes(stage.id);
        const locked = !isPractice() && stage.id > campaign.highestUnlocked;
        const targetSummary = localize('par', { par: stage.par });
        const best = campaign.best[stage.id];
        const earned = campaign.stars[stage.id] || 0;
        const status = locked ? localize('locked') : earned ? `${'★'.repeat(earned)}${'☆'.repeat(3 - earned)} · ${localize('shots')}: ${best}` : cleared ? localize('cleared') : localize('stageReady');
        return {
          id: stage.id,
          kicker: localize('orbit', { current: stage.id, total: rounds.length }),
          title: `${arcName(stage)} · ${stage.id}`,
          subtitle: localize('harvest') + ' · ' + stage.targets.length,
          status,
          summary: targetSummary,
          details: [targetSummary],
          locked,
          cleared,
          poster: POSTER,
        };
      },
    });
  }

  window.WeightPlayOrbitOrchardStageConfig = Object.freeze({ create });
})();
