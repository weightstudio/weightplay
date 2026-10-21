/* Prism Breakers Stage records; shared Play UI owns the selector and gestures. */
(() => {
  'use strict';

  window.WeightPlayPrismBreakersStageConfig = Object.freeze({
    create(game) {
      const poster = window.WEIGHTPLAY_INTERFACE7_POSTERS?.['animal-prism-breakers'];
      if (!poster) throw new Error('PRISM_BREAKERS_I9_POSTER_REQUIRED');
      const numberFormat = () => {
        const locale = window.WonderI18n?.actualLocale?.()
          || document.documentElement.lang
          || 'en';
        return { locale, format: new Intl.NumberFormat(locale) };
      };
      return {
        gameId: 'animal-prism-breakers',
        count: game.stageCount,
        poster,
        background: '/assets/lobby-block-atmosphere.svg',
        stage(index) {
          const number = index + 1;
          const progress = game.stageProgress(index);
          const config = window.BlockTrilogyConfig;
          const locale = window.PrismBreakersLocale;
          const { format } = numberFormat();
          const chapterIndex = Math.min(5, Math.floor(index / 5));
          const chapter = config.chapters[chapterIndex];
          const objective = config.ruleObjectives?.[chapterIndex] || '';
          const stageTitle = (locale?.copy?.stage || 'Stage {n}')
            .replace('{n}', format.format(number));
          const status = progress.locked
            ? (locale?.status?.locked || 'Locked') + ' · '
              + (locale?.status?.lockedNotice || 'Complete the previous stage first.')
            : progress.cleared
              ? (locale?.status?.clearedReplay || 'Cleared · Replay')
              : (locale?.status?.ready || 'Ready');
          const best = progress.best > 0 ? '★ ' + format.format(progress.best) : '';
          return {
            id: number,
            kicker: chapter,
            title: stageTitle,
            subtitle: objective,
            status,
            summary: objective,
            details: [chapter, objective, best].filter(Boolean),
            locked: progress.locked,
            cleared: progress.cleared,
            poster,
            posterPosition: 'center',
          };
        },
      };
    },
  });
})();
