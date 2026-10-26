/* Hoop League Stage records; WeightPlayPlayUI owns the selector and gestures. */
(() => {
  'use strict';

  window.WeightPlayHoopLeagueStageConfig = Object.freeze({
    create(game) {
      const poster = '/assets/interface7-redrawn/animal-hoop-league.webp';
      return {
        count: game.courts.length,
        poster,
        background: '/assets/lobby-block-atmosphere.svg',
        stage(index) {
          const number = index + 1;
          const court = game.courts[index];
          const copy = game.getCopy();
          const best = game.getBest();
          const record = Number(game.getRecords()[number]) || 0;
          const rival = court.rival.reduce((total, value) => total + value, 0);
          const locale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || 'en';
          return {
            id: number,
            kicker: game.getChapterName(index) + ' · ' + new Intl.NumberFormat(locale).format(number),
            title: game.getCourtName(index),
            subtitle: court.shots + ' ' + copy[15] + ' · ' + copy[18] + ' ' + rival,
            status: number > best + 1 ? '🔒' : record ? copy[16] + ' ' + record + ' ★' : copy[16] + ' —',
            summary: game.getStageGoals(index),
            details: game.getStageGuide(index),
            locked: number > best + 1,
            cleared: number <= best,
            poster,
            posterPosition: 'center',
          };
        },
      };
    },
  });
})();
