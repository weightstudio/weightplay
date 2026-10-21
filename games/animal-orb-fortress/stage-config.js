/* Game-owned records for the common I9 Stage selector. */
(() => {
  'use strict';

  const poster = '/assets/interface7-posters/animal-orb-fortress.webp';

  window.AnimalOrbFortressStageConfig = function createAnimalOrbFortressStageConfig({
    raids,
    translate,
    localize,
    getSave,
    wavesForTier,
  }) {
    if (!Array.isArray(raids) || typeof translate !== 'function' || typeof localize !== 'function'
      || typeof getSave !== 'function' || typeof wavesForTier !== 'function') {
      throw new TypeError('ORB_FORTRESS_STAGE_CONFIG_REQUIRED');
    }

    return {
      gameId: 'animal-orb-fortress',
      count: raids.length,
      poster,
      background: '/assets/lobby-block-atmosphere.svg',
      stage(index) {
        const raid = raids[index];
        if (!raid) throw new RangeError(`ORB_FORTRESS_STAGE_OUT_OF_RANGE:${index}`);
        const unlocked = Math.max(1, Math.min(raids.length, Number(getSave()?.bestRaid) || 1));
        const locked = raid.tier > unlocked;
        const waveCount = wavesForTier(raid.tier);
        const name = localize(raid.name);
        const objective = localize(raid.desc);
        const rule = translate(raid.rule);
        const waveLabel = `${waveCount} ${translate('waves')}`;

        return {
          id: raid.tier,
          kicker: translate('tierShort', { tier: raid.tier }),
          title: name,
          subtitle: objective,
          status: locked ? translate('tierLocked') : `${translate('enterRaid')} · ${waveLabel}`,
          summary: `${rule} · ${waveLabel}`,
          details: [objective, rule, waveLabel],
          poster,
          posterPosition: 'center',
          locked,
          cleared: raid.tier < unlocked,
        };
      },
    };
  };
})();
