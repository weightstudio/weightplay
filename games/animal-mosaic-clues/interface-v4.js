(() => {
  "use strict";

  const result = document.querySelector("#resultModal");
  const actions = result?.querySelector(".modal-actions");
  const stages = document.querySelector("#resultStage");
  const next = document.querySelector("#next");
  const replay = document.querySelector("#retry");
  if (!result || !actions || !stages || !next || !replay) return;

  actions.append(stages, next, replay);
  replay.textContent = window.BlockTrilogyConfig?.localeCopy?.replay || "Replay";

  const setPrimary = (target) => {
    for (const action of [stages, next, replay]) {
      action.classList.toggle("primary", action === target);
    }
  };

  const syncResult = () => {
    if (result.hidden) return;
    const state = window.__blockTrilogyTest?.getState?.();
    const failed = document.querySelector("#resultA")?.textContent.trim() === "—"
      && document.querySelector("#resultB")?.textContent.trim() === "—";
    const canContinue = Boolean(!failed && state && state.selected < 30 && state.unlocked > state.selected);

    next.hidden = false;
    next.disabled = !canContinue;
    next.setAttribute("aria-disabled", String(!canContinue));

    const primary = canContinue ? next : stages;
    setPrimary(primary);
    setTimeout(() => {
      if (!result.hidden) primary.focus({ preventScroll: true });
    }, 30);
  };

  new MutationObserver(syncResult).observe(result, {
    attributes: true,
    attributeFilter: ["hidden"],
    childList: true,
    subtree: true,
  });

  stages.addEventListener("click", () => {
    const targetStage = window.__blockTrilogyTest?.getState?.().unlocked;
    if (!targetStage) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.querySelector(`.stage-card[data-stage="${targetStage}"]`);
      if (!target || document.body.dataset.screen !== "stage") return;
      if (!target.classList.contains("centered")) target.click();
      target.focus({ preventScroll: true });
      setTimeout(() => {
        if (document.body.dataset.screen === "stage") {
          document.querySelector(`.stage-card[data-stage="${targetStage}"]`)?.focus({ preventScroll: true });
        }
      }, 320);
    }));
  });
})();
