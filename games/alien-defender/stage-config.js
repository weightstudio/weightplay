/* Authored Alien Defender data for the shared Interface 9 Stage rail. */
(() => {
  'use strict';

  window.AlienDefenderStageConfig = function AlienDefenderStageConfig({ t, stageConfig, count, unlocked, firepower, cleared }) {
    if(!Number.isInteger(count)||count<1)throw new TypeError('ALIEN_DEFENDER_AUTHORED_COUNT_REQUIRED');
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
        const goal = config.expansion ? t('stormGoal').replace('{n}',String(config.storm.beaconCount)) : t('stageGoal').replace('{stage}', String(number)).replace('{rule}', rule);
        return {
          id: number,
          kicker: config.boss ? `${rule} · ${t('boss')}` : rule,
          title: config.storm?.bossKey ? t(config.storm.bossKey) : `${t('stage')} ${number}`,
          subtitle: shotLabel(),
          status: locked ? t('stageLocked') : t('stageUnlocked'),
          summary: goal,
          details: [goal, shotLabel()],
          locked,
          cleared: cleared(number),
          poster: '/assets/interface7-redrawn/alien-defender.webp',
          posterPosition: 'center',
        };
      },
    };
  };
})();
