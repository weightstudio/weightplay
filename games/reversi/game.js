window.WPClassicLogic?.mount("reversi");

// Reversi has no turn-history owner in the shared Logic Lab runtime. Remove
// the generic Undo affordance instead of presenting a recovery action that
// announces success while leaving the board unchanged.
const reversiUndo = document.querySelector("#logicUndo");
if (reversiUndo) {
  reversiUndo.hidden = true;
  reversiUndo.disabled = true;
  reversiUndo.setAttribute("aria-hidden", "true");
  reversiUndo.dataset.logicAction = "unsupported";
}
