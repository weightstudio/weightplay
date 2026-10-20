(() => {
  'use strict';

  const POSTER = '/assets/interface7-redrawn/animal-orbit-orchard.webp';
  const BACKGROUND = '/assets/lobby-block-atmosphere.svg';

  function create({ rounds, getCampaign, localize, arcName }) {
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
        const locked = stage.id > campaign.highestUnlocked;
        const statusKey = locked ? 'locked' : cleared ? 'cleared' : 'stageReady';
        const targetNames = stage.targets.map(target => localize(target.beacon)).join(' → ');
        const targetSummary = stage.veiled
          ? localize('targetVeiled', { name: targetNames })
          : stage.targets.map(target => `${localize(target.beacon)} ${target.angle}°`).join(' → ');
        const best = campaign.bestByStage[stage.id];
        const status = `${localize(statusKey)}${best ? ` · ${localize('best')}: ${best}` : ''}`;
        return {
          id: stage.id,
          kicker: localize('orbit', { current: stage.id, total: rounds.length }),
          title: `${arcName(stage)}${stage.checkpoint ? ` · ${localize('checkpoint')}` : ''}`,
          subtitle: localize(stage.objective),
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
