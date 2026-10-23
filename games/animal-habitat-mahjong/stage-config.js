(() => {
  'use strict';

  function create({ habitats, getSave, t, stageLabel, stageIntroDescriptionText, stageDescriptionText }) {
    if (!Array.isArray(habitats) || typeof getSave !== 'function' || typeof t !== 'function' || typeof stageLabel !== 'function') {
      throw new TypeError('ANIMAL_HABITAT_MAHJONG_STAGE_CONFIG_REQUIRED');
    }

    return {
      gameId: 'animal-habitat-mahjong',
      count: habitats.length,
      poster: '/assets/animal-habitat-mahjong-cover.webp',
      background: '/assets/lobby-block-atmosphere.svg',
      stage(index) {
        const habitat = habitats[index];
        if (!habitat) throw new RangeError('ANIMAL_HABITAT_MAHJONG_STAGE_INDEX');
        const stageNumber = index + 1;
        const save = getSave();
        const unlocked = stageNumber <= Math.max(1, Number(save.unlocked) || 1);
        const cleared = Boolean(save.bestByStage?.[stageNumber]);
        return {
          id: stageNumber,
          kicker: t('stageTitle'),
          title: stageLabel(habitat, index),
          subtitle: t(habitat.title),
          status: !unlocked ? t('locked') : cleared ? t('habitatCleared') : habitat.checkpoint ? t('habitatFinale') : t('startGame'),
          summary: stageIntroDescriptionText(habitat),
          details: [stageDescriptionText(habitat)],
          locked: !unlocked,
          cleared,
          poster: `/assets/animal-habitat-mahjong-album-${habitat.id}.webp`,
        };
      },
    };
  }

  window.WeightPlayAnimalHabitatMahjongStageConfig = Object.freeze({ create });
})();
