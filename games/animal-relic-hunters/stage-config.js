/* Game-owned Stage records; the shared Play UI owns cards, gestures and layout. */
(() => {
  'use strict';

  const label = (locale, id) => {
    if (locale === 'zh-Hant') return `遠征 ${id}`;
    if (locale === 'es') return `Expedición ${id}`;
    if (locale === 'ar') return `الرحلة ${id}`;
    return `Expedition ${id}`;
  };

  const regionLabel = (locale, region) => {
    if (locale === 'zh-Hant') return `區域 ${region}`;
    if (locale === 'es') return `Región ${region}`;
    if (locale === 'ar') return `المنطقة ${region}`;
    return `Region ${region}`;
  };

  const guardianLabel = locale => ({
    'zh-Hant': '守護者', es: 'Guardián', ar: 'حارس',
  }[locale] || 'Guardian');

  window.AnimalRelicHuntersStageConfig = ({ expeditions, getProgress, text, getLocale }) => ({
    count: expeditions.length,
    poster: '/assets/interface7-redrawn/animal-relic-hunters.webp',
    background: '/assets/lobby-block-atmosphere.svg',
    stage(index) {
      const expedition = expeditions[index];
      const progress = getProgress();
      const locale = getLocale();
      const locked = expedition.id > progress.unlockedExpedition;
      const name = locale === 'zh-Hant' ? expedition.zh
        : locale === 'es' ? expedition.es
          : locale === 'ar' ? expedition.ar : expedition.en;
      const chapter = expedition.checkpoint
        ? guardianLabel(locale)
        : regionLabel(locale, expedition.region);
      const objective = locked
        ? text('expeditionLocked', { region: expedition.id - 1 })
        : text('expeditionGoal', { level: expedition.level });
      const cleared = expedition.id <= progress.bestExpedition;
      const status = locked ? '' : expedition.checkpoint ? guardianLabel(locale) : cleared ? '✓' : '';
      return {
        id: expedition.id,
        kicker: `${label(locale, expedition.id)} · ${chapter}`,
        title: name,
        subtitle: objective,
        status,
        summary: objective,
        details: [objective, `${label(locale, expedition.id)} · ${chapter}`],
        locked,
        cleared,
        posterPosition: 'center',
      };
    },
  });
})();
