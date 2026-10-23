/* Authored Alien Defender data for the shared Interface 9 Stage rail. */
(() => {
  'use strict';

  window.AlienDefenderStageConfig = function AlienDefenderStageConfig({ t, stageConfig, unlocked, firepower }) {
    const count = 30;
    const shotLabel = () => t('stagePower').replace('{shots}', String(firepower()));
    const ruleText = (config) => t(config.ruleKey);
    return {
      gameId: 'alien-defender',
      count,
      poster: '/assets/interface7-redrawn/alien-defender.webp',
      background: '/assets/lobby-block-atmosphere.svg',
      stage(index) {
        const number = index + 1;
        const config = stageConfig(number);
        const locked = index >= unlocked();
        const rule = ruleText(config);
        const goal = t('stageGoal').replace('{stage}', String(number)).replace('{rule}', rule);
        return {
          id: number,
          kicker: config.boss ? `${rule} · ${t('boss')}` : rule,
          title: `${t('stage')} ${number}`,
          subtitle: shotLabel(),
          status: locked ? t('stageLocked') : t('stageUnlocked'),
          summary: goal,
          details: [goal, shotLabel()],
          locked,
          cleared: index < unlocked() - 1,
          poster: '/assets/interface7-redrawn/alien-defender.webp',
          posterPosition: 'center',
        };
      },
    };
  };
})();
