/* Game records for the shared I9 Stage selector. */
(() => {
  "use strict";

  const poster = "/games/robot-dog-showtime/poster.svg";
  const background = "/assets/lobby-block-atmosphere.svg";

  window.RobotDogShowtimeStageConfig = ({ stages, getState, isSpotlightAvailable }) => ({
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
        kicker: `${stage.arc} · ${stage.id}/30`,
        title: `Stage ${stage.id}`,
        subtitle: `${stage.beats} beats · two performers`,
        status: practice ? "Local practice" : locked ? "Locked" : cleared ? "Cleared" : "Ready",
        summary: "Plan both performers' cues and reach their marks together.",
        details: [
          `${stage.beats} beats · ${stage.walls.length} blocked marks`,
          stage.bow ? "Both performers Bow on the final beat." : "Keep both routes clear of blocked marks and each other.",
        ],
        locked,
        cleared,
        posterPosition: "center",
        spotlightAvailable: !practice && isSpotlightAvailable(stage.id, state.save.cleared),
      };
    },
  });
})();
