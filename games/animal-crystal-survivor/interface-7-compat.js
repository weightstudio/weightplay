(() => {
  "use strict";

  const boot = () => {
    const stagePanel = document.getElementById("stagePanel");
    const stageNav = stagePanel?.querySelector(".stage-tabs");
    const stageTab = document.getElementById("stageTabBtn");
    const equipmentTab = document.getElementById("equipmentTabBtn");
    const resultPanel = document.getElementById("resultPanel");
    const resultCard = resultPanel?.querySelector(".result-card");
    const gamePanel = document.getElementById("gamePanel");
    const battleLive = document.getElementById("battleLive");

    /* Interface 7 Stage navigation owns three stable slots. This game has no
       Team screen, so the left slot intentionally remains empty. Reuse the
       existing Stages and Equipment buttons/listeners without cloning them. */
    if (stageNav) {
      stageNav.removeAttribute("data-wp-frame-nav");
      stageNav.setAttribute("data-wp-frame-stage-nav", "");
    }
    stageTab?.setAttribute("data-wp-frame-stage-slot", "stages");
    equipmentTab?.setAttribute("data-wp-frame-stage-slot", "equipment");

    const syncStageAccessibleName = () => {
      if (!stagePanel || !stageTab) return;
      stagePanel.removeAttribute("aria-labelledby");
      stagePanel.setAttribute("aria-label", stageTab.textContent.trim() || "Stages");
      if (stageNav && equipmentTab) {
        stageNav.setAttribute(
          "aria-label",
          `${stageTab.textContent.trim()} / ${equipmentTab.textContent.trim()}`
        );
      }
    };

    /* Result is a Battle substate. Rehome the three existing action nodes into
       one stable row; node identity and the v31 click handlers remain intact. */
    if (resultCard && !resultCard.querySelector(".wp-i7-result-actions")) {
      const actionRow = document.createElement("div");
      actionRow.className = "wp-i7-result-actions";
      actionRow.setAttribute("role", "group");
      for (const id of ["resultMenuBtn", "nextStageBtn", "retryBtn"]) {
        const button = document.getElementById(id);
        if (button) actionRow.append(button);
      }
      resultCard.append(actionRow);
    }
    resultPanel?.setAttribute("data-wp-battle-result", "");

    const syncResultSubstate = () => {
      if (!gamePanel || !resultPanel) return;
      const open = !resultPanel.classList.contains("hidden");
      if (open) {
        gamePanel.setAttribute("data-wp-battle-substate", "result");
        battleLive?.setAttribute("aria-hidden", "true");
      } else {
        gamePanel.removeAttribute("data-wp-battle-substate");
        if (!battleLive?.inert) battleLive?.removeAttribute("aria-hidden");
      }
    };

    syncStageAccessibleName();
    syncResultSubstate();

    window.addEventListener("wonder:locale-change", () => {
      queueMicrotask(syncStageAccessibleName);
    });

    if (resultPanel) {
      new MutationObserver(syncResultSubstate).observe(resultPanel, {
        attributes: true,
        attributeFilter: ["class", "hidden"],
      });
    }

    document.documentElement.dataset.wpCrystalInterfaceCleanup = "7";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
