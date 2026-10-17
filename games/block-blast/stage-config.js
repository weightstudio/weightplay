/* Localized records for the shared Stage cards; game code owns live progress. */
(() => {
  'use strict';

  window.BlockBlastStageConfig = ({stages, getState, text, objectiveSummary}) => {
    const objectiveKeys = {
      lines: 'lines',
      dirt: 'dirt',
      ice: 'iceStone',
      colors: 'colors',
      gems: 'gemsLocks',
      mixed: 'mixed',
    };

    return {
      count: stages.length,
      poster: '/assets/interface7-redrawn/block-blast.webp',
      background: '/assets/block-blast/workshop-block-v37.webp',
      stage(index) {
        const stage = stages[index];
        const state = getState();
        const category = text(objectiveKeys[stage.objective.kind]);
        const objective = objectiveSummary(stage);
        return {
          id: stage.number,
          kicker: category,
          title: String(stage.number).padStart(2, '0'),
          subtitle: objective,
          status: stage.number < state.unlocked ? text('clear') : '',
          summary: `${category} · ${objective}`,
          details: [text('stageHint'), `${category} · ${objective}`],
          locked: stage.number > state.unlocked,
          cleared: stage.number < state.unlocked,
          posterPosition: '50% 50%',
        };
      },
    };
  };
})();
