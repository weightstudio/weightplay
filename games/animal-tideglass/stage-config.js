/* Tideglass supplies records and assets; the shared Play UI owns Stage DOM and geometry. */
(() => {
  'use strict';
  window.TideglassStageConfig = ({rules,text,copy,getProgress}) => ({
    gameId: 'animal-tideglass',
    count: rules.TOTAL,
    poster: '/games/animal-tideglass/assets/animal-tideglass-cover-v2.png',
    background: '/assets/lobby-block-atmosphere.svg',
    stage(index) {
      const progress = getProgress();
      const level = rules.stages[index];
      const best = progress.best[index];
      const locked = index > rules.unlocked(progress);
      return {
        id: level.id,
        kicker: copy.modes[level.arc - 1],
        title: text('stage', {value: index + 1}),
        subtitle: '',
        status: locked ? text('locked') : best ? `${text('done')} · ${text('stars')} ${best.stars}/3` : '',
        summary: text('progress', {count: rules.completed(progress), total: rules.TOTAL}),
        details: [copy.guide[3]],
        locked,
        cleared: Boolean(best),
        poster: '/games/animal-tideglass/assets/animal-tideglass-cover-v2.png',
        posterPosition: 'center',
      };
    },
  });
})();
