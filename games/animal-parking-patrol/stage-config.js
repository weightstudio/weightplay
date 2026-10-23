(() => {
  'use strict';

  function create({ levels, getSave, t, chapterText }) {
    if (!Array.isArray(levels) || typeof getSave !== 'function' || typeof t !== 'function' || typeof chapterText !== 'function') {
      throw new TypeError('ANIMAL_PARKING_PATROL_STAGE_CONFIG_REQUIRED');
    }

    return {
      gameId: 'animal-parking-patrol',
      count: levels.length,
      poster: '/assets/animal-parking-patrol-cover.webp',
      background: '/assets/lobby-block-atmosphere.svg',
      stage(index) {
        const level = levels[index];
        if (!level) throw new RangeError('ANIMAL_PARKING_PATROL_STAGE_INDEX');
        const number = index + 1;
        const unlocked = number <= Math.max(1, Number(getSave().unlocked) || 1);
        const cleared = Boolean(getSave().completed?.[index]);
        return {
          id: index,
          kicker: t('chapter', { n: level.chapter + 1 }) + ' · ' + chapterText('chapters', level.chapter),
          title: t('stage', { n: number }),
          subtitle: t('goal', { n: level.carts.length }),
          status: !unlocked ? t('locked') : cleared ? t('cleared') : t('ready'),
          summary: chapterText('rules', level.chapter),
          details: [t('mistakeGoal')],
          locked: !unlocked,
          cleared,
          poster: '/assets/animal-parking-patrol-cover.webp',
        };
      },
    };
  }

  window.WeightPlayAnimalParkingPatrolStageConfig = Object.freeze({ create });
})();
