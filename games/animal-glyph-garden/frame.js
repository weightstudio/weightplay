(() => {
  "use strict";

  function mount({ localeSelect, stageRecord, selected, onSelect, onStart, isStageActive }) {
    const root = document.getElementById("app");
    const main = document.getElementById("mainScreen");
    const stage = document.getElementById("stageScreen");
    const battle = document.getElementById("battleScreen");
    const mainHeader = main?.querySelector(".main-header");
    const stageHeader = stage?.querySelector(".stage-header");
    const battleHeader = battle?.querySelector(".battle-header");
    const battleContent = battle?.querySelector(".battle-content");
    const frameRuntime = window.WeightPlayScreenFrame;
    if (!root || !main || !stage || !battle || !mainHeader || !stageHeader || !battleHeader || !battleContent || !frameRuntime) {
      throw new Error("GLYPH_GARDEN_SHARED_FRAME_REQUIRED");
    }

    const battleInfo = document.createElement("div");
    const frame = frameRuntime.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".main-content") },
        stage: { root: stage, header: stageHeader, content: stage.querySelector(".stage-content") },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleInfo },
      },
    });

    const arc = document.createElement("span");
    arc.id = "battleArc";
    arc.className = "battle-arc";
    const progress = document.createElement("span");
    progress.id = "progressPill";
    progress.className = "progress-pill";
    const group = frameRuntime.createGroup();
    group.add(arc).add(progress);
    frame.battleTopUI.add(group);

    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: document.getElementById("stagePage"),
      rail: document.getElementById("stageRail"),
      config: { ...window.GLYPH_GARDEN_STAGE_CONFIG, stage: stageRecord },
      selected,
      onSelect,
      onStart,
      isActive: isStageActive,
    });

    frame.activate("main");
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) frame.destroy();
    }, { once: true });
    return { frame, stageUI, battleArc: arc };
  }

  window.GlyphGardenI9Frame = Object.freeze({ mount });
})();
