/* Game data adapter for the shared I9 Stage selector. */
(() => {
  "use strict";

  const poster = "/games/animal-patchwork-paws/assets/animal-patchwork-paws-cover.svg";

  window.AnimalPatchworkPawsStageConfig = ({ patches, getState, text }) => ({
    count: patches.length,
    poster,
    background: poster,
    stage(index) {
      const patch = patches[index];
      const state = getState();
      const locked = index >= state.unlockedStage;
      const cleared = state.cleared.has(index);
      return {
        id: patch.number,
        kicker: `${text(patch.arc)} · ${patch.number}/${patches.length}`,
        title: text(patch.name),
        subtitle: text(patch.objective),
        status: locked ? text("locked") : cleared ? text("patchDone") : text("patchOpen"),
        summary: text(patch.objective),
        details: [text(patch.objective), text(patch.rule)],
        locked,
        cleared,
        posterPosition: "center",
      };
    },
  });
})();
