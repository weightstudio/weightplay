/* Game records for the shared I9 Stage selector. */
(() => {
  "use strict";

  const poster = "/assets/robot-dog-showtime-cover-v3.webp";
  const background = "/assets/lobby-block-atmosphere.svg";

  window.RobotDogShowtimeStageConfig = ({ stages, getState, text:t, isSpotlightAvailable }) => ({
    count: stages.length,
    poster,
    background,
    stage(index) {
      const stage = stages[index];
      const state = getState();
      const practice = state.practiceMode || state.practiceActive;
      const locked = !practice && stage.id > state.save.unlocked;
      const cleared = !practice && state.save.cleared.includes(stage.id);
      return {
        id: stage.id,
        kicker: `${stage.id}/${stages.length}`,
        title: `${t('stage')} ${stage.id}`,
        subtitle: `${stage.beats} ${t('beat')}`,
        status: `${t(practice?'practice':locked?'locked':cleared?'cleared':'ready')}${!practice&&state.save.ratings[stage.id]?' · '+state.save.ratings[stage.id]+'/3':''}`,
        summary: t('plan'),
        details: [
          `${stage.beats} ${t('beat')} · ${stage.walls.length} ${t('blocked')}`,
          stage.bow ? t('finalBow') : t('formation'),
        ],
        locked,
        cleared,
        posterPosition: "center",
        spotlightAvailable: !practice && isSpotlightAvailable(stage.id, state.save.cleared),
      };
    },
  });
})();
