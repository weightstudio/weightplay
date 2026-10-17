/* Game content adapter; shared frame and Play UI own all screen geometry. */
(() => {
  "use strict";

  window.mountCastleCascadeFrame = function mountCastleCascadeFrame() {
    const root = document.getElementById("gameFrame");
    const main = document.getElementById("main");
    const stage = document.getElementById("stage");
    const battle = document.getElementById("battle");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const localeSelect = document.getElementById("locale");

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageInfo = stageHeader.querySelector(".stage-hud");
    const stageTitle = document.createElement("strong");
    stageTitle.hidden = true;
    stageTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageTitle);

    const stageWorkspace = document.createElement("div");
    stageWorkspace.id = "stageWorkspace";
    stageWorkspace.append(document.getElementById("stageRail"));
    stage.insertBefore(stageWorkspace, document.getElementById("stageTabs"));
    stage.querySelector("#stageTabs").dataset.wpFrameNav = "";

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleInfo = battleHeader.querySelector(".royal-scoreboard");
    const battleTitle = document.createElement("strong");
    battleTitle.hidden = true;
    battleTitle.dataset.wpFrameTitle = "";
    battleHeader.replaceChildren(battleBack, battleTitle);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".hero") },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: { root: battle, header: battleHeader, content: battle.querySelector(".battle-content") },
      },
    });

    const stageGroup = window.WeightPlayScreenFrame.createGroup();
    for (const node of [...stageInfo.children]) stageGroup.add(node);
    stageInfo.remove();
    frame.stageTopUI.add(stageGroup);

    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    for (const node of [...battleInfo.children]) battleGroup.add(node);
    battleInfo.remove();
    frame.battleTopUI.add(battleGroup);

    const stagesButton = document.getElementById("stageTabButton");
    stagesButton.dataset.wpFrameAction = "tab";
    stagesButton.setAttribute("aria-pressed", "true");
    frame.commonDownButton.clear().add(stagesButton);

    frame.activate("main");
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) frame.destroy();
    });
    return frame;
  };
})();
