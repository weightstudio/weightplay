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
      const mastered = !practice && state.save.mastered?.includes(stage.id);
      const mixRating = Math.min(3,Number(state.save.performances?.[`${stage.id}:spotlight`]?.rating)||0)||(!practice&&state.save.remixFirstTry.includes(stage.id)?3:0);
      const mastery = stage.mastery ? `${t('mastery')} · ${t(stage.mastery.actor?'fox':'pup')} · ${t('visit')} ${stage.mastery.visit+1}${mastered?' ✓':''}` : '';
      const mix = !practice&&isSpotlightAvailable(stage.id,state.save.cleared) ? `${t('mix')} · ${mixRating?t('best')+' '+mixRating+'/3':state.save.remixCleared.includes(stage.id)?t('cleared'):t('ready')}` : '';
      return {
        id: stage.id,
        kicker: `${stage.id}/${stages.length}`,
        title: `${t('stage')} ${stage.id}`,
        subtitle: `${stage.beats} ${t('beat')}`,
        status: `${t(practice?'practice':locked?'locked':cleared?'cleared':'ready')}${!practice&&state.save.ratings[stage.id]?' · '+state.save.ratings[stage.id]+'/3':''}${mastered?' · ✓ '+t('mastered'):''}`,
        summary: mastery || t('plan'),
        details: [
          `${stage.beats} ${t('beat')} · ${stage.walls.length} ${t('blocked')}`,
          stage.bow ? t('finalBow') : t('formation'),mastery,mix,
        ].filter(Boolean),
        locked,
        cleared,
        posterPosition: "center",
        spotlightAvailable: !practice && isSpotlightAvailable(stage.id, state.save.cleared),
        spotlightRating: mixRating,
        spotlightCleared: !practice && state.save.remixCleared.includes(stage.id),
      };
    },
  });
})();
